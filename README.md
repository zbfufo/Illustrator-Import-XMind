<img width="935" height="198" alt="image" src="https://github.com/user-attachments/assets/29284e0b-239b-4fd6-b7f8-a269ff67325d" /><img width="1672" height="941" alt="photo" src="https://github.com/user-attachments/assets/8cd77f16-7c78-4fe7-9eb4-7630ffa15a70" />

# Illustrator Import XMind

- 将 XMind 思维导图导入 Adobe Illustrator，转换为可编辑的文字、节点和连接线，方便继续设计、调整和排版。
- 最新版本：v0.9.0 
- 脚本代码由 OpenAI Codex 编写完成。

## 主要功能

- 将 XMind 导入 Adobe Illustrator，生成可编辑的文字、节点和连接线。
- 保留主题层级、原始配色和图片内容。
- 支持“原图版面”和“智能排版”。
- 可调整字体、字号、文字颜色和背景。
- 支持自动预览、浅色与深色外观。
- 支持中文、英文、日文和韩文界面。
- 导入内容保存在一个总组中，方便整体移动和编辑。
- 同一个脚本兼容 Windows 和 macOS。
<img width="972" height="764" alt="download" src="https://github.com/user-attachments/assets/3525d88c-fa78-4b3c-9a1b-28ec666d2484" />


## 使用方法

### 下载脚本

打开 [Import XMind v0.9.0.jsx](https://github.com/zbfufo/Illustrator-Import-XMind/blob/main/Import%20XMind%20v0.9.0.jsx)，点击文件右上角的下载按钮（Download raw file），将脚本保存到电脑。

### 方式一：直接运行

1. 打开 Adobe Illustrator，新建或打开一个文档。
2. 选择“文件 → 脚本 → 其他脚本”。
3. 选择下载的 `.jsx` 文件，即可打开脚本窗口。

### 方式二：永久添加到脚本菜单

1. 退出 Adobe Illustrator。
2. 打开 Illustrator 的安装目录，找到当前语言对应的 **Scripts（脚本）** 文件夹。
3. 将下载的 `.jsx` 文件复制到该文件夹。
4. 重新启动 Illustrator。
5. 打开“文件 → 脚本”，点击对应的脚本名称即可运行。

**Windows 常见目录结构：**

`C:\Program Files\Adobe\Adobe Illustrator [版本]\Presets\[语言]\Scripts`

**macOS 常见目录结构：**

`/Applications/Adobe Illustrator [版本]/Presets.localized/[语言]/Scripts`

在 Mac 的访达中按 Command + Shift + G，粘贴对应的实际路径，即可前往文件夹。
其中，语言文件夹可能是 `zh_CN`、`en_US` 等；部分版本的文件夹名称会显示为“预设”“脚本”，请以实际安装目录为准。安装到哪个 Illustrator 版本，就会显示在哪个版本的脚本菜单中。

### 导入 XMind

1. 在脚本窗口中选择需要导入的 `.xmind` 文件。
2. 调整字体、字号、排版、颜色和背景。
3. 如需查看效果，勾选左下角的“预览”，展开右侧预览区。
4. 调整设置后，预览会自动更新；取消勾选即可收起预览区。
5. 点击“导入”，生成可编辑的思维导图。

预览在独立临时文档中生成，确认导入后才将内容添加到目标文档。导入结果统一放入一个总组，内部保留主题分组层级。

## 修改日志

### v0.9.0 · 图片主题导入

- 读取 XMind 文件中 resources 目录保存的图片资源。
- 支持纯图片主题，以及同时包含标题和图片的主题。
- 图片按比例缩放到节点内，并嵌入 Illustrator 文档，不依赖外部临时文件。
- 保留图片主题的节点背景、边框、连接线和父子层级。
- 纯图片主题不再创建“未命名主题”文字框；图片资源缺失时显示明确提示。
- 保持 v0.8.8 的 Windows 与 macOS 通用界面及文字对齐修复。

### v0.8.8 · Windows 文字显示修复

- 保持一个 Windows 与 macOS 通用的脚本文件。
- Windows 控件的系统底层标题改为空白，仅由脚本绘制一次文字，修复文字重叠、偏移和裁切。
- 恢复矩形外观按钮、下划线页签、方形预览框及底部操作按钮样式。
- Windows 根据中文、英文、日文和韩文界面选用对应的系统字体。
- “选择文件”按钮会根据当前界面语言和字体自动调整宽度，避免文字被裁切。
- 修正顶部“外观”选项，以及底部“预览／语言”一行的垂直对齐。
- 统一修正 Windows 自绘控件的文字基线，使外观按钮、文件按钮、页签、预览和底部操作按钮保持一致。
- macOS 保持原有控件绘制和排版逻辑。

### v0.8.7 · 标签显示修复

- 修复浅色外观下，“排版”和“外观”标签选中后文字不可见的问题。
- 统一标签文字、选中下划线及焦点提示的配色。
- 保留原位置点击切页的操作方式，切换时不重置设置或重新生成预览。

### v0.8.4–v0.8.6 · 双主题与多语言布局

- 新增深色、浅色外观切换，入口位于脚本名称右侧，默认使用深色。
- 统一 Windows 与 macOS 的界面实现，保留原生下拉菜单、直接输入及颜色选择器。
- 优化中、英、日、韩四种语言的文字宽度、控件间距和边距。
- 修复顶部外观按钮被裁切，以及日文“预览”文字显示不完整的问题。
- 切换外观时保留当前设置与预览，不改变导入内容的颜色。

### v0.8.2–v0.8.3 · macOS 界面适配与预览提示

- 调整 macOS 按钮、复选框及下拉框收起状态的绘制，改善浅色界面的显示。
- 优化预览生成期间的控件禁用与恢复，减少面板配色异常。
- 删除预览区域的重复提示，仅保留一条居中的文件选择提示。

### v0.8.1 · 名称与说明整理

- 脚本命名为 Import XMind。
- 整理修改日志与使用说明。
- 补充开发说明，明确脚本代码由 OpenAI Codex 完成。

### v0.8 · 简约窗口与按需预览

- 默认仅显示左侧设置，减少窗口占用。
- 勾选“预览”后展开右侧预览区，取消勾选后收起。
- 在语言选择框前新增“语言”标签，并随界面语言同步切换。
- 修复切换语言后“预览”文字被截断或遮挡的问题。
- 修复预览提示未随界面语言更新的问题。
- 调整部分翻译文字的显示宽度，减少内容裁切。
- 取消与导入按钮恢复软件默认字体和原生对齐方式。
- 将底部设置与操作按钮分行排列，改善小窗口中的使用体验。

### v0.7.1—v0.7.3 · 界面修复

- 修复自绘背景覆盖按钮和设置项的问题。
- 改用原生面板、按钮和分页。
- 修复部分下拉框及“选色”按钮右侧被裁切的问题。
- 调整输入框宽度、按钮间距和底部对齐。

### v0.7 · 界面整理与层级分组

- 采用浅灰白简洁配色，将设置整理为“排版”和“外观”两页。
- 新增中文、英文、日文和韩文界面。
- 将预览开关与语言选择放到左下角。
- 勾选预览后，选项变更自动刷新；输入框在确认输入后刷新。
- 移除手动更新按钮，以及“整体导图／节点细节”预览切换。
- 导入内容归入一个总组，内部按主题父子关系嵌套分组。
- 将背景、连接线与关系线一并纳入总组。

### 早期迭代 · 导入与排版基础

- 修复 Illustrator 中无法启动 PowerShell 的导入问题，改为脚本内部读取 XMind 文件。
- 新增文件选择、字体、字号与颜色设置。
- 支持保留 XMind 原始主题配色。
- 新增白色、黑色、透明及自定义背景。
- 新增原图版面与智能排版模式。
- 智能排版提供层级字号、缩进、宽文本与分栏布局。
- 支持可编辑文字、层级连接线及已有关系线。
- 新增独立临时文档预览。

## 当前支持范围

- “原图版面”保留方向、主题顺序及文件中已保存的坐标；没有坐标的主题按原结构补排，不保证与 XMind 画面完全一致。
- 当前主要导入主题文字、图片、颜色、父子层级和关系线。
- 暂不还原附件、边界、概要及局部富文本颜色。
- 切换界面语言不会翻译思维导图中的原始文字。
- 已使用包含 123 个主题的项目文件，在 Illustrator 中验证排版、嵌套分组、语言切换、窗口展开收起及自动预览。

## 问题反馈

如遇到导入失败、文字溢出或排版异常，请在 Issues 中提供 Illustrator 版本、问题截图和复现步骤；如方便，也可附上用于复现的 XMind 示例文件。
邮箱：zhangbofengkkk@gmail.com  ©zbfufo 



# Illustrator Import XMind

- Import XMind mind maps into Adobe Illustrator and convert them into editable text, nodes, and connector lines for further design, adjustment, and layout work. 
- Current version: v0.9.0
- The script code was created with OpenAI Codex.

## Main Features

- Imports XMind maps into Adobe Illustrator as editable text, nodes, and connector lines.
- Preserves topic hierarchy, original colors, and images.
- Supports “Original Layout” and “Smart Layout”.
- Provides font, text size, text color, and background options.
- Supports automatic preview and Light or Dark appearance.
- Supports Chinese, English, Japanese, and Korean interfaces.
- Places imported content in one main group for convenient movement and editing.
- Uses one script file for both Windows and macOS.

## Usage

### Download the Script

Open [Import XMind v0.9.0.jsx](https://github.com/zbfufo/Illustrator-Import-XMind/blob/main/Import%20XMind%20v0.9.0.jsx), click the download button in the upper-right corner of the file page (Download raw file), and save the script to your computer.

### Option 1: Run Directly

1. Open Adobe Illustrator and create or open a document.
2. Choose “File → Scripts → Other Script”.
3. Select the downloaded `.jsx` file to open the script window.

### Option 2: Permanently Add to the Scripts Menu

1. Quit Adobe Illustrator.
2. Open the Illustrator installation directory and locate the **Scripts** folder for your current interface language.
3. Copy the downloaded `.jsx` file into this folder.
4. Restart Illustrator.
5. Choose “File → Scripts”, then click the script name to run it.

**Typical Windows directory structure:**

`C:\Program Files\Adobe\Adobe Illustrator [version]\Presets\[language]\Scripts`

**Typical macOS directory structure:**

`/Applications/Adobe Illustrator [version]/Presets.localized/[language]/Scripts`

In Finder, press Command + Shift + G and paste the corresponding actual path to open the folder. Language folders may be named `zh_CN`, `en_US`, and so on. In some versions, folder names may appear as localized names such as “Presets” or “Scripts”; use your actual installation directory as the reference. The script will appear in the Scripts menu of the Illustrator version where it is installed.

### Import XMind

1. Select the `.xmind` file you want to import in the script window.
2. Adjust the font, text size, layout, colors, and background.
3. To view the result, enable “Preview” in the lower-left corner to expand the preview area on the right.
4. The preview updates automatically when settings change; uncheck it to collapse the preview area.
5. Click “Import” to generate an editable mind map.

The preview is generated in a separate temporary document. Content is added to the target document only after you confirm the import. The imported result is placed in one main group, with topic group hierarchy retained inside.

## Changelog

### v0.9.0 · Image Topic Import

- Reads image resources stored in the XMind file’s resources directory.
- Supports image-only topics and topics containing both a title and an image.
- Scales images proportionally inside their nodes and embeds them in the Illustrator document without external temporary-file dependencies.
- Preserves node backgrounds, borders, connector lines, and parent-child hierarchy for image topics.
- Image-only topics no longer create “Untitled Topic” text frames; a clear message is shown when an image resource is missing.
- Retains the shared Windows and macOS interface and text-alignment fixes from v0.8.8.

### v0.8.8 · Windows Text Display Fix

- Keeps one script file shared by Windows and macOS.
- Leaves native Windows control captions empty and draws each label once in the script, fixing overlapping, shifted, and clipped text.
- Restores rectangular appearance buttons, underlined tabs, the square Preview control, and footer action-button styling.
- Selects the matching Windows system font for the Chinese, English, Japanese, and Korean interfaces.
- Adjusts the “Choose File” button width according to the active language and font to prevent clipping.
- Fixes vertical alignment in the top Appearance controls and the bottom Preview/Language row.
- Corrects the shared Windows caption baseline so appearance buttons, file controls, tabs, Preview, and footer actions align consistently.
- Preserves the existing control drawing and layout behavior on macOS.

### v0.8.7 · Tab Display Fix

- Fixed an issue where the selected “Layout” and “Appearance” tab text became invisible in Light appearance mode.
- Unified the colors of tab text, selected underlines, and focus indicators.
- Kept page switching in its original location; switching pages does not reset settings or regenerate the preview.

### v0.8.4–v0.8.6 · Dual Themes and Multilingual Layout

- Added Dark and Light appearance switching next to the script title, with Dark as the default.
- Unified the interface implementation on Windows and macOS while retaining native dropdown menus, direct text input, and the color picker.
- Optimized text widths, control spacing, and margins for Chinese, English, Japanese, and Korean.
- Fixed clipped appearance buttons and incomplete Japanese “Preview” text.
- Switching appearance preserves current settings and previews, without changing imported artwork colors.

### v0.8.2–v0.8.3 · macOS Interface Adaptation and Preview Prompts

- Adjusted the drawing of macOS buttons, checkboxes, and collapsed dropdown menus to improve Light interface display.
- Optimized control disabling and restoration during preview generation to reduce panel color issues.
- Removed duplicate prompts in the preview area, retaining only one centered file-selection prompt.

### v0.8.1 · Naming and Documentation

- Named the script Import XMind.
- Organized the changelog and usage instructions.
- Added a development note stating that the script code was created with OpenAI Codex.

### v0.8 · Compact Window and On-Demand Preview

- Shows only the settings panel on the left by default to reduce window space usage.
- Expands the preview area on the right when “Preview” is enabled and collapses it when unchecked.
- Added a “Language” label before the language selector, which changes with the interface language.
- Fixed “Preview” text being truncated or obscured after changing interface languages.
- Fixed preview messages not updating with the interface language.
- Adjusted display widths for some translated text to reduce clipping.
- Restored the software’s default fonts and native alignment for the Cancel and Import buttons.
- Placed bottom settings and action buttons on separate rows to improve usability in the compact window.

### v0.7.1–v0.7.3 · Interface Fixes

- Fixed custom-drawn backgrounds covering buttons and settings.
- Switched to native panels, buttons, and tabs.
- Fixed clipping on the right side of some dropdown menus and “Pick Color” buttons.
- Adjusted input widths, button spacing, and bottom alignment.

### v0.7 · Interface Organization and Hierarchical Grouping

- Adopted a clean light gray and white color scheme, organizing settings into “Layout” and “Appearance” pages.
- Added Chinese, English, Japanese, and Korean interfaces.
- Moved the Preview toggle and language selector to the lower-left corner.
- Automatically refreshes the preview when options change while Preview is enabled; text fields refresh after input is confirmed.
- Removed the manual refresh button and the “Full Map / Node Details” preview switch.
- Places imported content in one main group, with nested topic groups following the parent-child hierarchy.
- Includes backgrounds, connector lines, and relationship lines in the main group.

### Early Iterations · Import and Layout Foundations

- Fixed the import issue caused by Illustrator being unable to launch PowerShell; XMind files are now read within the script.
- Added file selection, font, text size, and color settings.
- Added support for preserving original XMind topic colors.
- Added white, black, transparent, and custom backgrounds.
- Added Original Layout and Smart Layout modes.
- Smart Layout provides hierarchical text sizes, indentation, wider text blocks, and column layouts.
- Supports editable text, hierarchical connector lines, and existing relationship lines.
- Added previews generated in a separate temporary document.

## Current Support Scope

- “Original Layout” preserves direction, topic order, and coordinates saved in the file. Topics without coordinates are arranged based on the original structure and may not exactly match the XMind canvas.
- The importer currently focuses on topic text, images, colors, parent-child hierarchy, and relationship lines.
- Attachments, boundaries, summaries, and partial rich-text colors are not currently restored.
- Switching the interface language does not translate the original text in the mind map.
- A project file containing 123 topics has been used in Illustrator to verify layout, nested groups, language switching, window expansion and collapse, and automatic previews.

## Feedback

If you encounter import failures, text overflow, or layout issues, please provide your Illustrator version, screenshots, and steps to reproduce in Issues. If possible, also attach a sample XMind file that reproduces the issue. Email: zhangbofengkkk@gmail.com ©zbfufo
