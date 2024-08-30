function queryValues() {
    return [
        {
            key: 'abc',
            value: '1',
        },
        {
            key: 'bcd',
            value: '2',
        },

    ]
}

function APiQueryStruct() {
    return [
        {
            conditionStruct: {},
            formItemKey: "abc",
            formItemStruct: {options: Array(3)},
            label: "编程语言",
            message: "不为空",
            required: true,
        },
        {
            conditionStruct: {},
            formItemKey: "bcd",
            formItemStruct: {options: Array(3)},
            label: "编程语言",
            message: "不为空",
            required: true,
        },
    ]
}

function createValue (struct, values){

    return [
        {
            key: 'abc',
            value: '',
        },
        {
            key: 'bc',
            value: [
                '1',
                '2',
            ],
        },
    ];
}



function setup(){
    const formData = ref([]);
    const formDataMap = compute(() =>{
        const obj ={};
        formData.value.forEach();
        return obj;
    });
    const formStruct = ref([]);

    const computeQueryValus = async function () {
        const res = await queryValues();
        formData.value = createValue(struct.value, res);

    }
    const computeQueryStruct = async function () {
        const res = await APiQueryStruct();
        formStruct.value = res;
        formData.value = createValue(struct, formData.value);

    }
}

v-for=strcutItem in formStruct
:value=formDataMap[strcutItem.formItemKey].value
