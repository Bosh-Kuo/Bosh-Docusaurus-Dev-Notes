---
title: "NVIDIA Driver Problems After an Ubuntu 20.04.3 System Update"
slug: nvidia-driver-problem
authors: bosh
description: "A record of how I troubleshot an NVIDIA driver problem on Ubuntu, from working out the cause to trying different ways to reinstall the driver."
keywords: [Linux, Ubuntu, Nvidia Driver, Deep Learning]
tags: [Linux, Ubuntu, Nvidia Driver]
date: 2023-01-31
---

<!-- truncate -->

> These are my notes on troubleshooting an nvidia-driver problem. I'm not particularly familiar with Linux or NVIDIA deep learning environments, so corrections are welcome if I've got anything wrong!

## **Hardware and Software Versions** {#設備與軟體版本}

- Hardware:
    - GPU: RTX 3090
    - CPU: Intel Core i5-9500 CPU @ 3.00GHz × 6
- OS: Ubuntu 20.04.3
- Software versions:
    - nvidia-driver: 510.69.02
    - CUDA: 11.3

## **The Problem: A Black Screen and the Wrong Aspect Ratio After Rebooting** {#問題重新開機後螢幕黑屏畫面比例異常}

Our lab building had a scheduled power outage, so I shut down my computer the night before. When I turned it back on the next day, only one of my two previously working monitors displayed anything. Its aspect ratio was also way off, and I couldn't change it. I suspected a graphics driver issue, so I ran `nvidia-smi` to check whether nvidia-driver was working. Sure enough, it couldn't show any GPU information. I looked into the possible causes of NVIDIA driver problems and found a few common ones:

1. `An incompatible driver version`: An older driver may be incompatible with a newer system.
2. `A failed driver update`: An unsuccessful update can leave the driver in a broken state.
3. `Hardware failure`: A faulty NVIDIA GPU can cause driver problems.
4. `A system update`: After an update, the driver may no longer be compatible with the system.

In my case, the likely explanation was that an automatic Linux update had changed the kernel version, kernel functions, or other system settings, while the driver was still on an older version that wasn't compatible with the updated system.

## **The Fix: Reinstall the Driver** {#解決方法重新安裝驅動程式}

The solution was to reinstall the driver. Here are two ways to do that.

### **Installing from the Command Line** {#command-mode-安裝驅動}

You can install an NVIDIA driver directly with `apt install`, or download an installer from NVIDIA's website. The difference is that `apt install` uses Ubuntu's package management system, which helps ensure the driver version is compatible with the current Ubuntu release. Downloading and installing it manually from NVIDIA lets you choose the latest driver, but compatibility with your current Ubuntu version isn't guaranteed.

To avoid having graphical applications use the GPU during installation, I first pressed `ctrl + alt + F3` to switch to a full-screen text console, then entered:

```bash
# Make the driver installer executable
sudo chmod +x driver-installer.run

# Run the installer
sudo ./driver-installer.run
```

After following the installer instructions, I pressed `ctrl + alt + F2` to return to the graphical interface.

Another option is to run `sudo service lightdm stop` to stop the `X server` and close the graphical interface, then run `sudo service lightdm start` after installation to bring it back.

> The `X server` is part of the X Window System. It runs on Unix-like systems and manages graphical output and input. It handles displays, keyboards, mice, and other devices, allowing applications to draw graphics and respond to user input.

If installation succeeds, the display should return to normal when you switch back to the graphical interface. If it doesn't, try rebooting before investigating further.

### **Installing Through the Graphical Interface** {#圖型介面安裝}

If you're less comfortable with commands, or find them a little intimidating, you can try Ubuntu's graphical interface first:

1. Open “Display Settings,” usually found in the “Applications” menu.
2. Select the “Drivers” tab in “Display Settings.”
3. Select “Update Drivers.” If an NVIDIA driver is available, select it.
4. Install the driver and restart the system for it to take effect.

I haven't tried the graphical installation myself. If it doesn't work, try the command-line approach.

## **Tracing the Cause: Why Did an Ubuntu Update Trigger This?** {#追溯問題為什麼我的-ubuntu-系統更新才會發生這個問題}

System updates normally shouldn't leave a driver incompatible with the system, because they generally include driver updates to keep everything compatible. In some cases, though, a driver isn't updated through the system update process and has to be downloaded and installed manually. That's when compatibility problems can arise. This can happen because the driver comes from the hardware manufacturer rather than the operating system vendor.

To address this, we need to make sure the driver is updated along with the system:

1. In system settings, select “Software Updater” or “Software & Updates.”
2. Find the “Drivers” option and select “Automatically install driver updates.”
3. Once configured, the system will check for driver updates and install them automatically when available.

If the “Update Drivers” tab has `only a manual installation option`, a few things might explain it:

1. `The system isn't up to date`: An older system may not support automatic NVIDIA driver updates. Update the system first, then update the driver.
2. `Automatic updates are disabled`: With automatic updates disabled, you'll have to install the NVIDIA driver manually. Check the “Updates” tab in “Display Settings” to make sure automatic updates are enabled.
3. `No automatically installable driver update is available`: In that case, download the driver from NVIDIA's website and install it manually.

## **A Follow-up Question: Will Automatic Driver Updates Affect CUDA and cuDNN?** {#延伸問題自動更新驅動會不會影響到已經安裝好的-cuda-和-cudnn}

Newer drivers are usually backward compatible with older CUDA and cuDNN versions, but there can still be cases where a new driver doesn't work with an older CUDA or cuDNN release. As an exhausted grad student, research alone was already enough to wear me out. Having to fix my development environment every so often was one more headache I didn't need. My approach was to disable Ubuntu's automatic system updates. That means giving up the benefits of vulnerability fixes and improved system security, but it reduces the risk of incompatibilities between drivers and other software.
