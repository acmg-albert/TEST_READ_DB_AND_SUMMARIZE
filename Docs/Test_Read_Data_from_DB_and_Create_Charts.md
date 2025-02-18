**测试从Supabase数据库读数据展示交互式Web App数据图表汇总页面**

这个测试版本的Web App要展示两个有交互功能的页面。一个是汇总页面，第一层级，另一个是按照地区展示的页面，第二层级。第一层级汇总trailing 3 months的租金和一年前同期相比的变化百分比10大地区（或3大州），第二层级页面展示选定某个地区的租金及其变化曲线，以及趋势估测。第一层级页面有一个专门的按钮链接连第二层级页面，第二层级的页面也有一个专门的按钮链接返回第一层级的页面。

汇总后图表曲线背后的数据从Supabase的REAL\_ANALYTICS\_DB数据库数据表读入，数据库及数据表信息：

*   数据库URL: [https://qjdvcnyxsnsfsdhxfxlm.supabase.co](https://qjdvcnyxsnsfsdhxfxlm.supabase.co)
*   数据库API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZHZjbnl4c25zZnNkaHhmeGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MjQxOTIsImV4cCI6MjA1NTMwMDE5Mn0.KDve7Zj1s\_HKjR\_jKPE0F6djdRZQRg8E5UqBeyi35Io
*   数据表： apartment\_list\_rent\_estimates

以下是具体页面需求。

**第一层级汇总页面细节需求：**

这个页面要展示trailing 3 months的租金和一年前同期相比增长百分比最大的10大地区（或3大州）和增长百分比最小的10大地区（或3大州）（负增长）。这个计算百分比定义为：trailing 3个月每个月租金和一年前的同月租金相比计算变化百分比，然后把三个变化百分比做平均。比如说，如果trailing 3 months是：2015年1月，2024年12月，2024年11月，那么就分别和2024年1月，2023年12月，2023年11月相比计算变化百分比，然后做平均。用数据表里的rent\_estimate\_overall做计算。这个汇总需要给汇总出：

*   3大租金增长百分比最大的州
*   3大租金增长百分比最小的州（负增长）
*   10大租金增长百分比最大的都会区
*   10大租金增长百分比最小的都会区（负增长）
*   10大租金增长百分比最大的城市
*   10大租金增长百分比最小的城市（负增长）

这里要注意：数据表里的代表年月的列year\_month是character string字符串，“YYYY\_MM”的形式，比如2025年1月就是“2025\_01”，所以处理数据的时候要小心。

每个汇总表格式如下示意：

| Location | YYYY-MM 1 Rent (This is the second recent month in database) | YYYY-MM 2 Rent (This is the most recent month in database) | YYYY-MM 3 Rent (This is the third recent month in database) | Trailing 3 Month YOY Rent Growth |
| --- | --- | --- | --- | --- |
| Top 1 location name | xxx | xxx | xxx | xx% |
| Top 2 location name | xxx | xxx | xxx | xx% |
| … | … | … | … | … |

每个汇总表上显示的地区名字背后有链接可以直接点击跳转到第二层级的对应显示该地区租金曲线变化细节的页面。

**第二层级按照地区展示的细节页面细节需求：**

第二层级页面具体展示选定一个地区的租金在时间轴上的曲线，以及年同比变化百分比。这个页面左上角要有有两个下拉搜索选项框，第一个框是下拉选择和搜索地区的颗粒度，对应数据表的location\_type，有: National，State，Metro，County，City；第二个框是下拉选择和搜索具体地区名字，对应数据表的：location\_name；选择好地区的颗粒度之后具体地区会能下拉或者搜索数据表里有的对应颗粒度的地区名字。

选择好地区之后，页面上展示三个双坐标时间序列交互图表，这个图上显示该地区在数据表里最早的年月到数据表里最近的年月的租金曲线（带圆点marker的曲线）和租金年同比变化百分比的柱状图，左边的纵坐标对应租金，右边的纵坐标对应变化百分比，横轴为时间轴，并且横轴下方能有功能拖动时间范围，那样能让图上显示不同的时间范围的租金曲线和变化百分比柱状图。如果某个年月租金数据有数据缺失或者租金显示为0，这类情况就是数据invalid，那对应的月份的点和连线就不画出来，相应的变化百分比柱子也没有。这个交互图标要花三张，分别给：rent\_estimate\_overall，rent\_estimate\_1br，rent\_estimate\_2br三个metric画；并且要注意每个图表下方的时间拖动条拖动功能是独立的，即拖动调整一个图的时间范围的时候不会影响到另外两个图标的时间范围，不会是拖动一个图标的时间范围就三张图同时改变。

关于这个Web App的前端，需要是响应式的，及在电脑上看，和在手机或者ipad上看都能自动调整画面最佳的显示给用户看。曲线图的样式可以参考这个备份的APP: E:/Cursor\_AI/Real\_Analytics\_V20250207\_Backup