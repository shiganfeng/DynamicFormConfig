import {
    Menu,
    Dropdown,
    Button,
    Radio,
    Input,
    InputNumber,
    Select,
    Checkbox,
    Switch,
    DatePicker,
    Cascader,
    Form,
    Table,
    Tree,
    Modal,
    Progress,
    Empty,
    Popconfirm,
    Alert,
    Tooltip,
    Pagination,
    ConfigProvider
} from "ant-design-vue";

export default {
    install(app) {
        app.use(Menu);
        app.use(Dropdown);
        app.use(Button);
        app.use(Radio);
        app.use(Input);
        app.use(InputNumber);
        app.use(Select);
        app.use(Checkbox);
        app.use(Switch);
        app.use(DatePicker);
        app.use(Cascader);
        app.use(Form);
        app.use(Table);
        app.use(Tree);
        app.use(Modal);
        app.use(Progress);
        app.use(Empty);
        app.use(Popconfirm);
        app.use(Alert);
        app.use(Tooltip);
        app.use(Pagination);
        app.use(ConfigProvider);
    }
}