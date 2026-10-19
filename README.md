<img width="1672" height="941" alt="photo" src="https://github.com/user-attachments/assets/8cd77f16-7c78-4fe7-9eb4-7630ffa15a70" />

# Illustrator Import XMind

将 XMind 思维导图导入 Adobe Illustrator，转换为可编辑的文字、节点和连接线，方便继续设计、调整和排版。
当前版本：v0.8.1  
脚本代码由 OpenAI Codex 编写完成。

## 主要功能

- 导入 XMind 文件，保留主题文字和父子层级。
- 支持保留原始配色，也可选择预设颜色或输入自定义色号。
- 可选择导入字体与正文字号。
- 提供“原图版面”和“智能排版”两种模式。
- 智能排版支持“层级清晰”和“扁平分栏”，改善长文字的阅读体验。
- 背景支持白色、黑色、透明及自定义颜色。
- 勾选“预览”后展开右侧预览区，设置调整后自动更新；取消勾选即可收起。
- 支持中文、英文、日文和韩文界面。
- 导入内容统一放入一个总组，内部保留主题分组层级，便于整体移动和逐级编辑。

## 使用方法

### 下载脚本

打开 [Import XMind v0.8.1.jsx](https://github.com/zbfufo/Illustrator-Import-XMind/blob/main/Import%20XMind%20v0.8.1.jsx)，点击文件右上角的下载按钮（Download raw file），将脚本保存到电脑。

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

其中，语言文件夹可能是 `zh_CN`、`en_US` 等；部分版本的文件夹名称会显示为“预设”“脚本”，请以实际安装目录为准。安装到哪个 Illustrator 版本，就会显示在哪个版本的脚本菜单中。

### 导入 XMind

1. 在脚本窗口中选择需要导入的 `.xmind` 文件。
2. 调整字体、字号、排版、颜色和背景。
3. 如需查看效果，勾选左下角的“预览”，展开右侧预览区。
4. 调整设置后，预览会自动更新；取消勾选即可收起预览区。
5. 点击“导入”，生成可编辑的思维导图。

预览在独立临时文档中生成，确认导入后才将内容添加到目标文档。导入结果统一放入一个总组，内部保留主题分组层级。

## 修改日志

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
- 当前主要导入主题文字、颜色、父子层级和关系线。
- 暂不还原图片、附件、边界、概要及局部富文本颜色。
- 切换界面语言不会翻译思维导图中的原始文字。
- 已使用包含 123 个主题的项目文件，在 Illustrator 中验证排版、嵌套分组、语言切换、窗口展开收起及自动预览。

## 问题反馈

如遇到导入失败、文字溢出或排版异常，请在 Issues 中提供 Illustrator 版本、问题截图和复现步骤；如方便，也可附上用于复现的 XMind 示例文件。
邮箱：zhangbofengkkk@gmail.com
©zbfufo 


# Illustrator Import XMind

Import XMind mind maps into Adobe Illustrator as editable text, nodes, and connectors for further design, adjustment, and layout work.

Current version: v0.8.1  
The script code was written by OpenAI Codex.

## Main Features

- Import XMind files while preserving topic text and parent–child hierarchy.
- Preserve original colors, choose preset colors, or enter custom hex color codes.
- Choose the font and body text size for imported content.
- Choose between “Original Layout” and “Smart Layout.”
- Smart Layout supports “Clear Hierarchy” and “Compact Columns” to improve readability for longer text.
- Choose a white, black, transparent, or custom background.
- Enable “Preview” to expand the preview panel on the right. It updates automatically when settings change; uncheck it to collapse the panel.
- Chinese, English, Japanese, and Korean interfaces are available.
- All imported content is placed in one main group, with topic group hierarchies preserved inside for moving the entire map and editing individual levels.

## Usage

### Download the Script

Open [Import XMind v0.8.1.jsx](https://github.com/zbfufo/Illustrator-Import-XMind/blob/main/Import%20XMind%20v0.8.1.jsx), click the download button (**Download raw file**) in the upper-right corner of the file toolbar, and save the script to your computer.

### Option 1: Run Directly

1. Open Adobe Illustrator and create or open a document.
2. Choose **File → Scripts → Other Script**.
3. Select the downloaded `.jsx` file to open the script window.

### Option 2: Permanently Add to the Scripts Menu

1. Exit Adobe Illustrator.
2. Open the Illustrator installation directory and locate the **Scripts** folder for your current interface language.
3. Copy the downloaded `.jsx` file into that folder.
4. Restart Illustrator.
5. Open **File → Scripts** and click the script’s name to run it.

**Typical Windows directory structure:**

`C:\Program Files\Adobe\Adobe Illustrator [version]\Presets\[language]\Scripts`

The language folder may be `zh_CN`, `en_US`, or another language code. Some versions display localized folder names, such as “预设” and “脚本.” Refer to your actual installation directory. The script will appear in the Scripts menu of the Illustrator version where it is installed.

### Import XMind

1. Select the `.xmind` file you want to import in the script window.
2. Adjust the font, text size, layout, colors, and background.
3. To view the result, enable “Preview” in the lower-left corner to expand the preview panel on the right.
4. The preview updates automatically after settings change. Uncheck “Preview” to collapse the panel.
5. Click “Import” to generate an editable mind map.

Previews are generated in a separate temporary document. Content is added to the target document only after you confirm the import. The imported result is placed in one main group, with topic group hierarchies preserved inside.

## Changelog

### v0.8.1 · Naming and Documentation

- Named the script Import XMind.
- Organized the changelog and usage instructions.
- Added a development note clarifying that the script code was written by OpenAI Codex.

### v0.8 · Compact Window and On-Demand Preview

- Show only the settings panel on the left by default to reduce window space.
- Expand the preview panel on the right when “Preview” is enabled, and collapse it when unchecked.
- Added a “Language” label before the language selector, which changes with the interface language.
- Fixed the “Preview” caption being truncated or obscured after switching languages.
- Fixed preview messages not updating with the interface language.
- Adjusted the display widths of some translated labels to reduce clipping.
- Restored the default application font and native alignment for the Cancel and Import buttons.
- Arranged the bottom settings and action buttons on separate rows to improve usability in the compact window.

### v0.7.1–v0.7.3 · Interface Fixes

- Fixed custom-drawn backgrounds covering buttons and settings.
- Switched to native panels, buttons, and tabs.
- Fixed clipping on the right side of some dropdown menus and color picker buttons.
- Adjusted input widths, button spacing, and bottom alignment.

### v0.7 · Interface Organization and Hierarchical Grouping

- Introduced a simple light gray and white color scheme, organizing settings into “Layout” and “Appearance” tabs.
- Added Chinese, English, Japanese, and Korean interfaces.
- Moved the preview toggle and language selector to the lower-left corner.
- Automatically refresh the preview when options change while Preview is enabled; text fields refresh after input is confirmed.
- Removed the manual refresh button and the “Full Map / Node Details” preview switch.
- Placed imported content in one main group, with nested groups following the topic parent–child hierarchy.
- Included backgrounds, connectors, and relationship lines in the main group.

### Early Iterations · Import and Layout Foundations

- Fixed the import issue caused by Illustrator being unable to launch PowerShell, replacing it with XMind file reading inside the script.
- Added file selection, font, text size, and color settings.
- Added support for preserving original XMind topic colors.
- Added white, black, transparent, and custom backgrounds.
- Added Original Layout and Smart Layout modes.
- Smart Layout introduced text sizes based on hierarchy, indentation, wider text blocks, and column layouts.
- Added support for editable text, hierarchy connectors, and existing relationship lines.
- Added previews generated in a separate temporary document.

## Current Support Scope

- “Original Layout” preserves directions, topic order, and coordinates saved in the file. Topics without coordinates are positioned according to the original structure, so the result is not guaranteed to match XMind’s appearance exactly.
- The importer currently focuses on topic text, colors, parent–child hierarchy, and relationship lines.
- Images, attachments, boundaries, summaries, and colors applied to individual portions of rich text are not currently reproduced.
- Switching the interface language does not translate the original mind-map text.
- A project file containing 123 topics has been used in Illustrator to verify layouts, nested grouping, language switching, window expansion and collapse, and automatic previews.

## Feedback

If you encounter import failures, text overflow, or layout problems, please provide your Illustrator version, screenshots, and steps to reproduce the issue in Issues. If possible, include a sample XMind file that reproduces the problem.

Email: zhangbofengkkk@gmail.com  
©zbfufo
