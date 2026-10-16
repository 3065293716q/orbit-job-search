import usCatalog from './us-catalog.json';
import chinaCatalog from './china-catalog.json';
export type CatalogOpportunity={company:string;role:string;location:string;url:string;priority:string;notes:string;country?:string};

// 这部分是经国际学生初筛后保留的方向；每条记录仍需以官方 JD 为准。
const eightCurated:CatalogOpportunity[]=[
  {company:'Limitless Space Institute',role:'Space research / data / program opportunity',location:'Houston, TX, USA',url:'https://www.limitlessspace.org/',priority:'A',notes:'公司信息：Houston 的空间探索教育与研究机构。JD/要求：优先关注研究支持、数据分析、项目协调与科学传播；只投明确接受 CPT/OPT 且无出口管制限制的岗位。截止日期：以官网发布为准。'},
  {company:'FlightAware',role:'Data analytics / Python / product opportunity',location:'Houston, TX, USA',url:'https://www.flightaware.com/about/careers/',priority:'A',notes:'公司信息：商业航空数据与软件平台。JD/要求：数据分析、Python、数据产品或软件工程；申请前核验 CPT/OPT 与后续 sponsorship。截止日期：以官网发布为准。'},
  {company:'Quantlab',role:'Data engineering / machine learning opportunity',location:'Houston, TX, USA',url:'https://www.quantlab.com/',priority:'B',notes:'公司信息：数据与量化研究方向公司。JD/要求：Python、数据工程、机器学习、研究软件；不是航天主线，作为 AI/数据备选，需无公民、绿卡或 clearance 限制。截止日期：以官网发布为准。'},
  {company:'LASP',role:'Scientific computing / space data opportunity',location:'Boulder, CO, USA',url:'https://lasp.colorado.edu/careers/',priority:'A',notes:'公司信息：University of Colorado 的空间科学与仪器研究机构。JD/要求：科研计算、科学数据、遥感/行星科学支持；按项目核验 export-control 限制与 CPT 可行性。截止日期：以官网发布为准。'},
  {company:'Southwest Research Institute',role:'Scientific software / space data opportunity',location:'San Antonio / Boulder / Houston, USA',url:'https://www.swri.org/careers',priority:'B',notes:'公司信息：科研与工程研发机构。JD/要求：科学软件、数据分析、空间科学、技术项目；部分项目对国际生开放，必须逐岗位核验。截止日期：以官网发布为准。'},
  {company:'LeoLabs',role:'Space data / mission operations opportunity',location:'California / Remote, USA',url:'https://leolabs.space/careers/',priority:'A',notes:'公司信息：空间态势感知与雷达数据公司。JD/要求：空间数据、数据科学、任务运营或软件；优先商业数据岗位，政府客户相关岗位需核验身份限制。截止日期：以官网发布为准。'},
  {company:'TransAstra',role:'Engineering physics / systems analysis opportunity',location:'Los Angeles, CA, USA',url:'https://transastra.com/',priority:'B',notes:'公司信息：空间资源与航天技术公司。JD/要求：工程物理、科研计算、系统分析；申请前核验 ITAR/U.S. person 限制。截止日期：以官网发布为准。'},
  {company:'ArianeGroup',role:'International space systems opportunity',location:'France / Europe',url:'https://www.ariane.group/en/careers/',priority:'C',notes:'公司信息：欧洲发射与航天系统企业。JD/要求：数据、工程或空间系统；不作为美国主投，若出现法国/欧洲签证条件允许的实习再单独评估。截止日期：以官网发布为准。'}
];
export const curatedOpportunities:CatalogOpportunity[]=[...usCatalog as CatalogOpportunity[],...chinaCatalog as CatalogOpportunity[],...eightCurated];
