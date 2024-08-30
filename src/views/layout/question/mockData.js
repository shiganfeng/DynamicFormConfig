const mockData = [
    {
        label: '编程语言',
        type: 'VRadio',
        model: 'language',
        required: true,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: '', // 字段名
            value: '', // 这个字段的值
        },
        options: [
            {
                label: 'JavaScript',
                code: 'JavaScript'
            },
            {
                label: 'Python',
                code: 'Python'
            },
            {
                label: 'Java',
                code: 'Java'
            },
        ]
    },
    {
        label: '擅长的前端框架',
        type: 'VCheckbox',
        model: 'frameworks',
        required: true,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: '',
            value: ''
        },
        options:[
            {
                label: 'Vue',
                code: 'Vue'
            },
            {
                label: 'React',
                code: 'React'
            },
            {
                label: 'Angular',
                code: 'Angular'
            }
        ]
    },
    {
        label: '学习时间',
        type: 'VDateTime',
        model:'studyTime',
        required: true,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: '',
            value: ''
        },
        options: []
    },
    {
        label: '是否补课',
        type: 'VSwitch',
        model:'make',
        required: true,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: '',
            value: ''
        },
        options: []
    },
    {
        label: '学习的科目',
        type: 'VSingleSelect',
        model: 'studyProject',
        required: true,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: '',
            value: ''
        },
        options:[
            {
                label: '语文',
                code: 'Chinese'
            },
            {
                label: '数学',
                code: 'Math'
            }
        ]
    },
    {
        label: '爱好',
        type: 'VMultipleSelect',
        model: 'hobby',
        required: false,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: '',
            value: ''
        },
        options:[
            {
                label: '足球',
                code: 'Football'
            },
            {
                label: '篮球',
                code: 'Basketball'
            }
        ]
    },
    {
        label: '编程语言的值为JavaScript时才显示',
        type: 'VInput',
        model:'opinion',
        required: false,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: 'language',
            value: 'JavaScript'
        },
        options: []
    },
    {
        label: '擅长的前端框架的值为[Vue, React]时才显示',
        type: 'VInput',
        model:'tip',
        required: true,
        message: '不为空',
        condition: { // 动态显示：选择这个表单的某一项的特定值的时候才显示
            model: 'frameworks',
            value: ['Vue', 'React']
        },
        options: []
    },
];

// 区分绑定值的类型
const arrayPropertyTypes = ['VCheckbox', 'VMultipleSelect'];
const booleanPropertyTypes = ['VSwitch'];
const stringPropertyTypes = ['VRadio', 'studyTime', 'VSingleSelect', 'VInput'];

export {
    mockData,
    arrayPropertyTypes,
    booleanPropertyTypes,
    stringPropertyTypes
}