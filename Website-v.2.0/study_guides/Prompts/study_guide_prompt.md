# Prompt Template for AP Study Guides

**Role:** Expert Frontend Web Developer and AP Educator.

**Input Variables:**
- **[Class Name]:** {User Input}
- **[Resource Link]:** {User Input}

**Task:** Create a highly detailed, yet VERY VERY VERY DIGESTIBLE study guide for **[Class Name]** as a single HTML page named appropriately (e.g., `AP_Target_Subject.html`). The styling, layout architecture, stylesheets, and fonts must exactly mirror the provided [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html).

**Research Step:**
Before generating the code, explore the provided **[Resource Link]** to structure the guide around the official College Board Unit-by-Unit breakdown, core themes, and specific exam format details for **[Class Name]**.

**Reference File:**
- [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html): Use this as the source of truth for all HTML boilerplate, metadata, Webflow CSS inclusions ([css/normalize.css](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/css/normalize.css), [css/webflow.css](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/css/webflow.css), [css/crossroadstutoring.webflow.css](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/css/crossroadstutoring.webflow.css)), Google Fonts (Open Sans, Montserrat), JavaScript imports, and the exact structures of the `<nav>` bar and the footer/contact sections.

**Content & Structure Requirements:**
You must batch the development and logical structure of the page into the following sections:

### 1. Infrastructure
- Retain the exact `<head>` from [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html), but change the `<title>` and meta descriptions to relate to the **[Class Name]** Study Guide.
- Include the CrossRoads Tutoring Navigation bar exactly as it appears in [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html).
- Create a new Hero Section (using the `.hero.section` format with SVG patterns/waves from [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html)) titled **"[Class Name]"** with a subheader "Study Guide". Add a brief introductory paragraph summarizing the subject.
- Ensure the footer and contact sections from [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html) are perfectly replicated at the bottom of the page.

### 2. Unit-by-Unit Mastery (Units 1 - N)
For each unit found in the AP course description, create a dedicated, beautifully styled section. Use alternating background colors like `.pale-yellow`, `.blue`, or `.purple` based on the classes found in [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html) to separate them cleanly.
To ensure maximum digestability:
- Use clear bullet points.
- Bold the names of major concepts, vocabulary, theorems, and themes.
- Keep descriptions concise but highly informative for AP test preparation.

### 3. Test Format + Tips
Create a final dedicated section emphasizing AP exam strategies tailored specifically to **[Class Name]**:
- **Multiple Choice Questions:** Strategies for tackling the specific style of questions on this exam (e.g., stimulus-based for History, problem-solving for Math/Science).
- **Free-Response Questions (FRQs):** Detailed breakdown of the FRQ sections unique to this test. Elaborate on the formatting rules (e.g., Document-Based actions for Sciences, Context/Thesis rubrics for History, specific language syntax for Computer Science). Provide a reliable solving framework corresponding to this subject.

**Output Constraints:**
Output the final code incrementally or fully, ensuring absolute strict adherence to the visual styles of [index.html](file:///home/stepheng753/Development/Websites/CrossRoadsTutoring/Website-v.2.0/index.html) without introducing any new or external CSS frameworks. Focus immensely on readability, scanning ease, and premium design presentation.
