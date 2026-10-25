---
title: "Gitmoji x Conventional Commits Workflow (3): Generating CHANGELOG.md with commit-and-tag-version"
slug: gitmoji-x-conventional-commit-workflow-commit-and-tag-version
authors: bosh
description: Writing clear, structured changelogs with Keep a Changelog, generating them with commit-and-tag-version, and making practical adjustments to improve the maintenance workflow.
keywords: [Conventional Commits, Gitmoji, Commitizen, Commitlint, Husky, Git-hook, commit-and-tag-version, standard-version, CHANGELOG.md ]
tags: [Implementation Notes]
date: 2024-12-04
image: https://res.cloudinary.com/djtoo8orh/image/upload/v1733057458/Docusaurus%20Blog/Blog/Conventional%20Commit%20with%20Gitmoji/Conventional_Commit_with_Gitmoji-3_okqmuy.png
---

## **Why Changelogs Matter** {#變更日誌的意義與重要性}

### **What Is a Changelog?** {#變更日誌是什麼}

In a software project, a **changelog** is a running history of feature changes, bug fixes, and improvements. It's usually written for developers and testers. It helps people working on the project understand its history quickly, and can save a lot of time when a rollback is needed.

The main goal is to make changes between versions understandable. A changelog has a few practical benefits:

1. It makes the project more transparent: team members and users can quickly see what changed in each update.
2. It saves the team time by explaining changes in one place, instead of making everyone investigate them again.
3. It helps with issue tracking and rollbacks.

<!-- truncate -->

### **How Do You Write a Good Changelog?** {#如何寫出好的變更日誌}

You might think, how hard can it be? Just write a few bullet points. But making a changelog clear and well organized takes a little thought. That's where [**Keep a Changelog**](https://keepachangelog.com/zh-TW/0.3.0/) comes in. It's a set of conventions for writing clear, structured changelogs, addressing common problems such as disorganized entries, inconsistent formatting, and uncertainty about what to include.

### **Core Principles of a Good Changelog** {#好的變更日誌的核心原則}

A few of its principles are especially useful:

- **Write for people:** Keep the language natural. The goal is for readers to understand it, not to make it look like machine code.
- **Keep it structured and easy to read:** Use Markdown so people can jump to or reference specific entries.
- **Keep an `Unreleased` section at the top:** Put changes that haven't been released here, then move them into the appropriate version section at release time.
- **Put the newest version first:** Use reverse chronological order so the latest changes are easy to find.
- **Use a consistent date format:** `YYYY-MM-DD`, such as `2024-11-21`, is clear and works across locales.
- **Follow Semantic Versioning:** Help readers understand the scope of a change, just as version numbers do: minor versions for new features, patch versions for bug fixes.
- **Group changes by category:** Use these labels to make entries easier to scan:
    - **Added:** New features.
    - **Changed:** Changes to existing functionality.
    - **Deprecated:** Features that are discouraged but haven't been removed.
    - **Removed:** Removed features.
    - **Fixed:** Bug fixes.
    - **Security:** Security vulnerability fixes.

### **What Does a Good Changelog Look Like?** {#好的-change-log-長什麼樣子}

Here's an example following Keep a Changelog:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- v1.1 Brazilian Portuguese translation.
- v1.1 German Translation

### Changed

- Use frontmatter title & description in each language version template
- Replace broken OpenGraph image with an appropriately-sized Keep a Changelog 
  image that will render properly (although in English for all languages)
- Fix OpenGraph title & description for all languages so the title and 
description when links are shared are language-appropriate

### Removed

- Trademark sign previously shown after the project description in version 
0.3.0

## [1.1.1] - 2023-03-05

### Added

- Arabic translation (#444).
- v1.1 French translation.

### Fixed

- Improve French translation (#377).
- Fix missing logo in 1.1 pages.

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.

```

**How the template is organized**

1. **`Unreleased`:** Changes go here until they're ready for a version number, then move into a release section.
2. **Version sections:** Each release has a section with its version and date, such as `[1.0.0] - 2024-11-21`.
3. **Categories:** Labels such as `Added` and `Fixed` group changes so readers can find them quickly.

<br/>

## Tool Overview: **commit-and-tag-version** {#工具概覽-commit-and-tag-version}

### **Choosing a Changelog Generator** {#自動化-change-log-工具選擇}

Changelogs are useful, but imagine maintaining one by hand for every release. You'd have to go through every commit since the previous version, then sift out the less important changes. That's a lot of work.

Many open-source projects use generators to help maintainers pull out important commits. Some also integrate with CI/CD to bump versions and publish release notes when a branch is merged into the main branch. While looking into these tools, I found several options:

**1. [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog?tab=readme-ov-file)**

- **Features:**

    `conventional-changelog` focuses on generating changelogs. It parses Git commit messages according to [Conventional Commits](https://www.conventionalcommits.org/) and produces the log, without additional release-management features.

- **Limitations:**

    It doesn't support Gitmoji natively. In my tests, I couldn't get it to generate the changelog correctly even with `conventional-changelog-gitmoji-config`, following the tutorials I found.

**2. [standard-version](https://github.com/conventional-changelog/standard-version)**

- **Features:**

    Along with generating changelogs, `standard-version` can bump versions, create Git tags, and commit the changes.

- **Status:**

    It's the predecessor of `commit-and-tag-version`, but has been marked **deprecated** and is no longer maintained. Stalled maintenance and difficulty extending it left it unable to meet a wider range of use cases.

**3. [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version)**

- **Features:**

    `commit-and-tag-version` is a fork of `standard-version` that improves and extends it:

    - **Ongoing maintenance:** Community support keeps it aligned with current needs.
    - **Flexible configuration:** More detailed controls for different workflows.
    - **Integration:** Inherits `standard-version`'s features and supports customization through `.versionrc` files.

**4. [semantic-release](https://github.com/semantic-release/semantic-release)**

- **Features:**

    `semantic-release` is the most capable option here. Beyond changelogs, it supports more involved automation, including pushing changes and publishing to npm or GitHub.

- **Limitations:**

    The setup is more complex and may be excessive if all you need is changelog generation. This post doesn't cover integration with remote repositories, so I didn't choose it.

> After downloading and testing all these tools, I settled on `commit-and-tag-version`. Of the options I tried, it seemed to offer a fairly complete feature set and flexible configuration. Most importantly, it was still receiving updates, so I wasn't worried about maintenance stopping in the near term.

### **The Basic commit-and-tag-version Workflow** {#commit-and-tag-version-的基本工作流}

According to its documentation, the workflow is:

1. **Follow Conventional Commits:**

    Make sure the project's commit messages follow [**Conventional Commits**](https://www.conventionalcommits.org/).

2. **Run `commit-and-tag-version`:**
    - **Read the current version:** Get it from `packageFiles` or the latest Git tag.
    - **Bump the version:** Choose the next version based on the commit messages.
    - **Generate a changelog:** Use the underlying `conventional-changelog` tooling to produce a structured log.
    - **Create a commit:** Commit the new version number and changelog.
    - **Create a Git tag:** Tag the new version.

:::tip
`commit-and-tag-version` has a useful **dry run mode**. It previews the commands and generated changelog without changing files or Git history.

- Run:

    ```bash
    npx commit-and-tag-version --dry-run
    ```

- Example output:

    ```bash
    $ commit-and-tag-version
    ✔ bump version from 1.0.0 to 1.1.0
    ✔ generate CHANGELOG.md
    [Dry Run Mode] Skipping tag creation and commit.
    ```
:::

### **Focusing on Changelog Generation** {#聚焦-change-log-生成}

For this post, we're only interested in generating the changelog, so we'll disable version bumping, commits, and tagging through CLI options or a configuration file. `commit-and-tag-version` supports `.versionrc`, `.versionrc.json`, and `.versionrc.js`. CLI options can also be set directly in the configuration.

Here's a **`.versionrc`** example that skips some default steps:

```json
{
  "skip": {
    "bump": true,  // Skip version bumping
    "changelog": false,
    "commit": true,  // Skip the automatic commit
    "tag": true  // Skip automatic tagging
  }
}
```

> You can also skip these steps with the CLI flags `—skip.bump`, `—skip.commit`, and `—skip.tag`.

:::note **How do I customize the changelog format?**
By default, `commit-and-tag-version` uses the [**conventionalcommits preset**](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits) to select commit types and format them in the changelog. We can adjust that format in `.versionrc`. The changelog-related configuration is defined in the [**Conventional Changelog Configuration Spec (v2.1.0)**](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md).
:::

<br/>

## **Generating CHANGELOG.md Without Gitmoji** {#無使用-gitmoji-的自動化-changelogmd-生成}

Let's build on the configuration from the first two posts and use **commit-and-tag-version** to generate a changelog in a workflow without Gitmoji.

### **Installation** {#安裝}

First, install `commit-and-tag-version`:

```bash
npm install --save-dev commit-and-tag-version
```

### **Configuring `.versionrc.js`** {#配置-versionrcjs-文件}

Create `.versionrc.js` in the project root:

```jsx
module.exports = {
  types: [
    { type: "feat", section: "✨ Features" },
    { type: "fix", section: "🐛 Bug Fixes" },
    { type: "docs", section: "📝 Documentation" },
    { type: "style", section: "🎨 Styles" },
    { type: "refactor", section: "♻️ Code Refactoring" },
    {
      type: "perf",
      section: "⚡ Performance Improvements",
    },
    { type: "test", section: "✅ Tests" },
    { type: "revert", section: "⏪ Revert" },
    {
      type: "build",
      section: "📦 Build System",
    },
    {
      type: "chore",
      section: "🔧 chore",
    },
    {
      type: "ci",
      section: "👷 Continuous Integration",
    },
  ],
  skip: {
    bump: true,
    changelog: false,
    commit: true,
    tag: true,
  },
};
```

### Generating CHANGELOG.md {#生成-changelogmd}

Add a generation command to the scripts in `package.json`:

```json
"scripts": {
  "release": "commit-and-tag-version"
},
```

This configuration produces a `CHANGELOG.md` like this:

```markdown
# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 1.1.0 (2024-11-25)

### ✨ Features

* rEADME 5f9cf7e

### 🐛 Bug Fixes

* a bug fix fec43ca

### 📦 Build System

* package.json 70d5f77

### 🔧 chore

* .gitignore ca32df4
```

:::caution **Things to keep in mind**

- **Commit messages must follow Conventional Commits:**

    The generator needs messages in the expected format. For example:

    ```bash
    feat: add third-party login
    fix: fix login page button styles
    ```

- **Include other commit types yourself:**

    The default configuration only generates `Features` and `Bug Fixes` sections. If you need other types, such as documentation changes or performance improvements, add them to `.versionrc.js` using the [**Conventional Changelog Configuration Spec (v2.1.0)**](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md).
:::

<br/>

## **Maintaining a Useful Changelog in Practice** {#實踐維護變更日誌的最佳方式}

Automation makes changelogs easy to generate, but a little manual editing still helps them serve the team and its users. Let's look at where a changelog fits into the workflow and when to add or adjust information so it makes the project easier to follow.

### **Where Does the Changelog Fit in the Workflow?** {#如何將-change-log-納入工作流}

**1. During development: start with good commit messages**

A good changelog starts with the commits. If messages are inconsistent or lack detail, even a powerful generator can't produce a good log. During development, I'd recommend:

- **Use a consistent commit format:**

    Use Conventional Commits or Gitmoji to make the type and content of changes clear. For example:

    ```bash
    feat: add user login
    fix: fix login page button styles
    ```

- **Give the message enough context:**

    Keep it concise, but describe the change accurately. For example:

    - **Not very useful:**

        ```makefile
        fix: fix button issue
        ```

    - **More useful:**

        ```makefile
        fix: fix login page button styles to prevent overlap
        ```

**2. After merging: generate the first draft**

Once a feature is complete and merged into the main branch, use a tool such as `commit-and-tag-version` to generate an initial changelog. The goal is to capture the commits correctly, but the result may still need editing.

For example, a generator might produce:

```markdown
## [1.2.0] - 2024-11-22
### ✨ Features
- Add a role management module [#c2e3b7](https://example.com/commit/c2e3b7)

### 🐛 Bug Fixes
- Fix permission checks when deleting roles [#a1b2c3](https://example.com/commit/a1b2c3)
```

This is close to publishable, but a few manual changes can make it easier to read.

### **What to Edit Manually** {#手動調整的關鍵點}

A generated changelog is based on commit messages, so some entries may be unclear or incomplete. Here are common edits:

**1. Add context**

Add enough context for readers to understand the impact. For example:

- **Generated entry:**

    ```markdown
    ### ✨ Features
    - Add a role management module [#c2e3b7](https://example.com/commit/c2e3b7)
    ```

- **After adding context:**

    ```markdown
    ### ✨ Features
    - Add a role management module with support for viewing, editing, and deleting roles [#c2e3b7](https://example.com/commit/c2e3b7)
    ```

**2. Adjust the template wording**

The generator's template may not match your project. You can change its settings directly, such as customizing section headings in `.versionrc.js`:

```jsx
module.exports = {
  types: [
    { type: "feat", section: "🚀 Features" },
    { type: "fix", section: "🛠️ Fixes" },
  ],
};
```

The output becomes:

```markdown
### 🚀 Features
- Add a role management module [#c2e3b7](https://example.com/commit/c2e3b7)

### 🛠️ Fixes
- Fix permission checks when deleting roles [#a1b2c3](https://example.com/commit/a1b2c3)
```

**3. Add an `## [Unreleased]` section manually**

Most tools generate logs for released versions and don't cover unreleased changes. Add an `## [Unreleased]` section to help the team track what's currently changing.

- **Example section to add:**

    ```markdown
    ## [Unreleased]
    ### 🚀 Features
    - Support password resets [#d4e5f6](https://example.com/commit/d4e5f6)
    ```

This serves as a temporary record for the upcoming release. Move the entries to the appropriate version section when you release it.

<br/>

## **Wrapping Up: An Efficient, Transparent Commit Workflow** {#結語打造高效且透明的提交工作流}

Across these three posts, we've built a Git commit workflow step by step, from writing consistent messages to generating a structured changelog. Each part helps the team collaborate and makes the project's changes easier to follow.

### **What commit-and-tag-version Automates** {#commit-and-tag-version-的自動化優勢}

This post focused on `commit-and-tag-version` for version management and changelog generation. It helps us produce structured logs quickly and provides flexible settings for developers using Gitmoji.

### **Why Automation Helps** {#自動化工具在工作流中的重要性}

From **Commitizen**'s interactive prompts, through **Commitlint** and **Husky** validation, to generating the changelog, these tools take repetitive work out of daily development. They keep the process consistent and let the team focus on the product, with less friction from unclear communication or missed steps.

Here's the Conventional Commits workflow we've put together:

1. **Commitizen:** Interactive prompts help write messages without memorizing the format.
2. **Commitlint and Husky:** Validate messages during a commit to keep invalid ones out of the history.
3. **commit-and-tag-version:** Generate a structured changelog so version changes are clear and traceable.

Along with making messages easier to read, the automation helps the team work more efficiently and makes the project more transparent.

### **Future** {#future}

Adopting Conventional Commits is an ongoing process. As the team grows and the project's needs change, we can add more advanced tools such as `semantic-release` to build a more automated, scalable DevOps workflow.

I hope these three posts give you some useful ideas for your own project. If you've tried a different approach or have experiences to share, feel free to leave a comment. I'd love to hear how you're making your workflow more efficient!

<br/>

## **Reference** {#reference}

- [**How I See the Difference Between Release Notes and Changelogs in a Product**](https://sean22492249.medium.com/%E6%88%91%E5%BF%83%E4%B8%AD-release-note-%E8%88%87-changelog-%E5%9C%A8%E7%94%A2%E5%93%81%E4%B8%AD%E6%87%89%E7%94%A8%E7%9A%84%E5%B7%AE-a466a69ae595)
- [**Keep a Changelog**](https://keepachangelog.com/zh-TW/0.3.0/)
- [**Conventional Changelog**](https://github.com/conventional-changelog/conventional-changelog?tab=readme-ov-file)
- [**standard-version**](https://github.com/conventional-changelog/standard-version)
- [**conventional-changelog-cli**](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)
- [**conventional-changelog-gitmoji-config**](https://github.com/arvinxx/gitmoji-commit-workflow/tree/master/packages/changelog#readme)
- [**commit-and-tag-version**](https://github.com/absolute-version/commit-and-tag-version)
- [**Conventional Changelog Configuration Spec (v2.1.0)**](https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md)
