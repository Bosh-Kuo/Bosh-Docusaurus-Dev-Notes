---
title: "Publishing and Installing Private npm Packages with GitLab Package Registry"
slug: gitlab-package-registry
authors: bosh
description: "How to publish and install private npm packages with GitLab Package Registry, including registry basics, authentication, permissions, and package.json settings."
keywords: [GitLab,  GitLab package registry, npm, yarn, npm package]
tags: [GitLab, npm, yarn]
date: 2024-07-22
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1728568594/Docusaurus%20Blog/Blog/Gitlab%20Package%20Registrty/gitlab_package_registry_zkdf9c.png
---

> **Some background:**  
> I've recently been building an npm package for our internal frontend team. One challenge was that I'd never developed an npm package before, so I was starting from scratch with the development environment, bundling, publishing, and maintenance. The company also didn't want to open-source the package or pay for npm Orgs' private package feature. Alongside learning how to build the package, I had to find a free way to host a private npm library that would work for us.

<!-- truncate -->

## **The Problem** {#問題}

I looked into how our company had been publishing npm libraries. The development and publishing process for our shared libraries looked roughly like this:

- On the development side:

```
Edit the source → Build locally → Push the source and built files to GitLab → Decide whether to add a tag based on the changes.
```

- On the consumer side:

```
Manually specify the package project path and version in package.json → Clone the entire library project from GitLab into the local node_module directory
```

I felt this workflow had a few underlying problems:

1. Installing a package also downloaded its source and other static files, making node_module unnecessarily large.
2. The built files consumers downloaded weren't pinned to a package version.
3. Publishing was entirely manual: building, updating the version, and writing the CHANGELOG. That made it hard to maintain and easy to miss a step, such as bumping the version without rebuilding the latest code.

> To me, the core issue was that the built files consumers download should be hosted separately from the source code.

Packages installed with `npm install` are generally hosted on the public npm registry. But npm's free plan only supports hosting open-source packages, which didn't meet our need for private npm packages.

After some searching, I found a convenient option: `GitLab Package Registry`. It works much like the npm registry while allowing private hosting. After trying it, I found it capable and easy to use. This post records how to publish a private npm library to GitLab and install it from there.

## **An Introduction to GitLab Package Registry** {#gitlab-package-registry-簡介}

### **What Is a Package Registry?** {#package-registry-是什麼}

A **package registry** is simply a place to store and manage software packages. Think of it as a warehouse for packages, where developers can share and reuse code and modules.

`GitLab Package Registry` lets us manage npm packages on GitLab. We can host both our source code and npm packages on the same platform, which is convenient for companies and private teams already using GitLab.

### **How Does GitLab Host npm Packages?** {#gitlab-如何作為-npm-package-的容器}

Before publishing a library, let's look at how GitLab hosts npm packages.

Each GitLab project has its own Package Registry: an independent space that can store and manage multiple npm packages. Each project's registry has a unique URL, usually based on the project ID. If the project ID in our example were 123, its Package Registry URL might look like this:

```json
https://<your_domain_name>/api/v4/projects/123/packages/npm/
```

This URL tells npm where to upload or download packages.

### **Scopes and GitLab's Package Naming Rules** {#scope-與-gitlab-的套件命名規則}

How does npm know which packages to download from that URL?

In npm, a **scope** is a namespace for organizing packages under an organization or team and avoiding naming conflicts. For example, `@my-org/my-package` belongs to `@my-org`.

When hosting npm packages in GitLab Package Registry, the package name in package.json needs to follow GitLab's naming rules:

```json
"name": "@scope/package-name"
```

:::tip
**@scope** should be the **root namespace of the project hosting the package**, rather than the project containing its source code. Use lowercase letters.

For example, if the npm package is hosted at:

- http://\<your_domain_name>/**\<instance_name>**/\<group_name>/\<project_name>
    - Use `@<instance_name>` as @scope.
- http://\<your_domain_name>/**\<group_name>**/\<project_name>
    - Use `@<group_name>` as @scope.
- http://\<your_domain_name>/**\<user_name>**/\<project_name>
    - Use `@<user_name>` as @scope.

You can choose any **package-name**.
:::

In the consuming project, create an `.npmrc` file with:

```bash {3}
# Set URL for your scoped packages.
# For example package with name `@foo/bar` will use this URL for download
@<scope>:registry <your domain name>/api/v4/projects/<project id>/packages/npm/
```

When we install a package whose name starts with the configured scope, npm knows to download it from the specified registry URL.

### **npm Registry Authentication** {#npm-registry-身份驗證}

When publishing or installing npm packages with GitLab Package Registry, npm authenticates the request to check whether we have permission to publish to or download from that registry.

- When publishing, npm uses npm config / .npmrc and package.json for authentication.
- When installing private packages, npm also uses npm config / .npmrc for authentication.

GitLab provides several authentication methods:

- [Personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html): Authenticates with a user's permissions. Suitable for individual use.
- [Project deploy token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html): Created for a particular project and suitable for multiple users. Provides access to all packages within that project.
- [Group deploy token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html): Created for a particular group and suitable for multiple users. Can access all packages within that group.
- [Job token](https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html): For publishing packages in CI/CD pipelines. This is the only option for publishing npm packages through CI/CD pipelines.

:::danger
If “Package registry” is disabled in the project settings, every authentication method will return 403 Forbidden.
:::

### **GitLab Package Registry Permissions** {#gitlab-package-registry-權限}

Project roles have different permissions for the Package Registry. The table below lists the minimum role for each operation:

| Project visibility | Operation             | Minimum role |
| ------------------ | --------------------- | ------------ |
| Public             | View package registry | None         |
|                    | Publish package       | Developer    |
|                    | Pull package          | None         |
| Internal           | View package registry | Guest        |
|                    | Publish package       | Developer    |
|                    | Pull package          | Guest        |
| Private            | View package registry | Reporter     |
|                    | Publish package       | Developer    |
|                    | Pull package          | Reporter     |

:::info
GitLab also lets you allow anyone to pull packages, regardless of **project visibility** and **minimum role**:

1. **Settings > General**.
2. \> **Visibility, project features, permissions**.
3. → **Allow anyone to pull from Package Registry**
4. → **Save changes**.
:::

<br/>

## **Preparing GitLab Package Registry** {#準備-gitlab-package-registry}

With the basics covered, we can try publishing an npm library to GitLab. Let's start with the GitLab setup.

### **Creating a GitLab Project** {#建立-gitlab-project}

For this example, I created a new GitLab project under my personal namespace. Its project ID is 691.

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665264/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/gitlab_project_kd7zeb.png)

### **Setting Up a Deploy Token** {#設定-deploy-token}

Go to Setting > Repository > Deploy tokens to configure a [Project deploy token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html). Click Create deploy to generate a token, and make sure to save it.

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665263/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/deploy_token_tzkyrw.png)

<br/>

## **Publishing the Local npm Project** {#發布本地端的-npm-專案}

Once GitLab is ready, we can prepare the local npm library for publishing. For this example, I created and exported a simple function in `index.js` at the project root to stand in for the library:

```js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

### **Preparing .npmrc** {#準備-npmrc}

When publishing a package, `.npmrc` does two things:

1. Specifies the registry for packages whose names start with **@\<scope>**.
2. Supplies an **authToken** to authenticate with that registry URL.

Create an `.npmrc` file in the package project and add:

```bash {3,7}
# Set URL for your scoped packages.
# For example package with name `@foo/bar` will use this URL for download
@<scope>:registry <your domain name>/api/v4/projects/<project id>/packages/npm/

# Add the token for the scoped packages URL. Replace <your_project_id>
# with the project where your package is located.
//<your domain name>/api/v4/projects/<project id>/packages/npm/:_authToken=<your token>
```

- **@\<scope>**: Since this GitLab project is under my personal namespace, this is my GitLab username: @bosh.kuo.
- **\<your domain name>**: The company's GitLab domain.
- **\<project id>**: 691.
- **\<your token>**: The project deploy token we just created.

### **Preparing package.json** {#準備-packagejson}

Before publishing, make sure these fields are configured correctly. They directly affect how the package is published and used.

- **name**: The package name, following GitLab's naming rules above.
- **version**: The package version. Remember to update it for each new release.
- **publishConfig**: Publishing options, particularly the registry URL. Set this to the GitLab Package Registry URL.
- **files**: The files to include in the published package. This is usually `lib` or `dist`, the output directory for the built files, depending on your project structure.
- **main**: The package's main entry point, used when someone installs and consumes the package.
- **module**: If the package is written with ES modules, this can specify its ES module entry point.
- **types**: For TypeScript projects, this points to the type declaration file so consumers get full type support.

Here's package.json for this example:

```json
{
  "name": "@bosh.kuo/published-package",
  "version": "0.0.0",
  "publishConfig": {
    "registry": "https://gitlab.xxx.com/api/v4/projects/691/packages/npm/"
  },
  "main": "index.js",
  "files": [
    "index.js"
  ],
  ...
}
```

### **Publishing** {#發布}

With everything ready, publish the npm package:

```bash
# for npm user
npm publish

# for yarn user
yarn publish
```

Once published, it appears in **GitLab Package Registry**:

![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665263/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/npm_package_eypqeo.png)

> The screenshot shows @bosh.kuo/published-package1 and @bosh.kuo/published-package2, which I published later while experimenting with managing multiple npm libraries in a monorepo. They aren't the package from this example; the screenshot is just for illustration.

<br/>

## **Using npm Packages from GitLab Package Registry** {#使用-gitlab-package-registry-上的-npm-套件}

Now we can create a local consumer project and try installing the package we just published.

1. Create a test consumer project.

    ```bash
    mkdir consumer
    cd consumer
    yarn init -y
    ```

2. Authenticate with the npm registry.

    ```bash {3,7}
    # Set URL for your scoped packages.
    # For example package with name `@foo/bar` will use this URL for download
    @<scope>:registry <your domain name>/api/v4/projects/<project id>/packages/npm/
    
    # Add the token for the scoped packages URL. Replace <your_project_id>
    # with the project where your package is located.
    //<your domain name>/api/v4/projects/<project id>/packages/npm/:_authToken=<your token>
    ```

    This is the same `.npmrc` configuration as in the previous section.

    Alternatively, configure it with `npm config set`:

    ```bash
    npm config set @<scope>:registry <your domain name>/api/v4/packages/<project id>/npm/
    
    npm config set -- '//<your domain name>/api/v4/packages/npm/:_authToken' "<your_token>"
    ```

3. Install the package.

    ```json
    yarn add @bosh.kuo/published-package
    ```

    If installation succeeds, you'll find the package under `node_modules`. Its files and directories should match the `files` field we set in `package.json` earlier.

    ![](https://res.cloudinary.com/djtoo8orh/image/upload/v1721665263/Docusaurus%20Blog/Node.js/Gitlab%20package%20registry%20%E7%99%BC%E5%B8%83%E8%88%87%E4%B8%8B%E8%BC%89%E7%A7%81%E4%BA%BA%20npm/package_in_node_modules_qa60do.png)

4. Test the package.

    ```jsx
    // index.js
    const sum = require("@bosh.kuo/published-package");
    console.log(sum(10, 20));
    ```

    If everything worked, you should see `30` in the output.

:::tip
If you see the correct result, congratulations! You've successfully published a private npm package to GitLab Package Registry, installed it, and used it.
:::

<br/>

## **Reference** {#reference}

- [**Package registry**](https://docs.gitlab.com/ee/user/packages/package_registry/)
- [**npm packages in the package registry**](https://docs.gitlab.com/ee/user/packages/npm_registry/#404-not-found-errors-are-happening-on-npm-install-or-yarn)
- [**Packaging a Vue Component and Publishing It to an Internal GitLab Package Registry**](https://hackmd.io/@RdUg6kDRTcKHmb2WGCucdA/HyxdsQo-7q)
- [**Creating and Using a Private GitLab npm Package Registry**](https://xenby.com/b/288-%E6%95%99%E5%AD%B8-%E5%BB%BA%E7%AB%8B%E8%88%87%E4%BD%BF%E7%94%A8-gitlab-%E7%A7%81%E4%BA%BA-npm-package-registry)
- [**@npm - package.json**](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [**Publish private NPM package to Gitlab**](https://www.youtube.com/watch?v=Yn0N8_Gfcyw&t=540s&ab_channel=JackDo)
- [**Publishing Private NPM Package to Gitlab | Using Manual Command & Gitlab Action | SmrutiFy**](https://www.youtube.com/watch?v=jIA_ksPKR9w&t=235s&ab_channel=SmrutiFy)
