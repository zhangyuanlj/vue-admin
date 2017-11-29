import Vue from 'vue';
import MainView from './main/index.js';
import MenuList from './menu/index.js';
import Pannel from './pannel/index.js';
import {
    BasicTable,
    DataTable,
    TableBtns
} from './basicTable/index.js';
import {
    SelectTable,
    SelectTableCheckbox
} from './selectTable/index.js';
import SpinLoading from './spin/index.js';
import {
    TreeView,
    ComboTree
} from './treeView/index.js';
import {
    Amap,
    Marker,
    RoutePlanne,
    SelectAddress
} from './amap/index.js';
import CitySelect from './citySelect/index.js';
import PageTab from './pageTab/index.js';
import ContextMenu from './contextMenu/index.js';
import RenderHtml from './renderHtml/index.js';
import Reference from './reference/index.js';
import ContentPage from './contentPage/index.js';
import DistPicker from './distPicker/index.js';
import {
    GridLayout
} from './gridLayout/index.js';
import QueryForm from './queryForm/index.js';
import FormDetail from './formDetail/index.js';
const components = {
    MainView: MainView,
    MenuList: MenuList,
    Pannel: Pannel,
    BasicTable: BasicTable,
    DataTable: DataTable,
    TableBtns: TableBtns,
    SelectTable: SelectTable,
    "SelectTable-Checkbox": SelectTableCheckbox,
    SpinLoading: SpinLoading,
    Pannel: Pannel,
    TreeView: TreeView,
    ComboTree: ComboTree,
    Amap: Amap,
    "Amap-Marker": Marker,
    "Amap-RoutePlanne": RoutePlanne,
    CitySelect: CitySelect,
    PageTab: PageTab,
    ContextMenu: ContextMenu,
    RenderHtml: RenderHtml,
    Reference: Reference,
    "Content-Page": ContentPage,
    DistPicker: DistPicker,
    "Grid-Layout": GridLayout,
    "Amap-Select-Address-Tool": SelectAddress,
    QueryForm: QueryForm,
    FormDetail: FormDetail
};
for (let key in components) {
    Vue.component(key, components[key]);
}