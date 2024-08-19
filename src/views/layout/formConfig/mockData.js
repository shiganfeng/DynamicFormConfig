const mockData = {
    id: "1823901287541579777",
    formCode: "sgf",
    formName: "sgf表单",
    formStruct: {
        postscript: "表单的备注",
        groups: [
            {
                uniqueKey: "v_a1aiocpcp5o",
                groupCode: "code_组一的groupCode",
                groupName: "组一",
                groupStruct: {
                    postscript: "组一的备注",
                    formItems: [
                        {
                            uniqueKey: "v_2dtl5539d8o",
                            detailCode: "项目一的detailCode",
                            detailName: "项目一",
                            formItemStruct: {
                                postscript: "项目一的备注",
                                config: {
                                    formItemType: "VInputText",
                                    disabled: false,
                                    required: true,
                                    sourceMethod: {
                                        methodType: "OnlyInput",
                                        methodTypeParams: [

                                        ]
                                    }
                                }
                            }
                        },
                        {
                            uniqueKey: "v_l70asi2t78",
                            detailCode: "项目二的detailCode",
                            detailName: "项目二",
                            formItemStruct: {
                                postscript: "项目二的备注",
                                config: {
                                    formItemType: "VInputText",
                                    disabled: false,
                                    required: true,
                                    sourceMethod: {
                                        methodType: "OnlyInput",
                                        methodTypeParams: [

                                        ]
                                    }
                                }
                            }
                        },
                        {
                            uniqueKey: "v_15efhkiokr8",
                            detailCode: "项目三的detailCode",
                            detailName: "项目三",
                            formItemStruct: {
                                postscript: "项目三的备注",
                                config: {
                                    formItemType: "VRateThousand",
                                    disabled: false,
                                    required: true,
                                    sourceMethod: {
                                        methodType: "ComputeAdd",
                                        methodTypeParams: [
                                            "项目一的detailCode",
                                            "项目二的detailCode"
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                uniqueKey: "v_ucp7383qp08",
                groupCode: "code_组二的groupCode",
                groupName: "组二",
                groupStruct: {
                    postscript: "组二的备注",
                    formItems: [
                        {
                            uniqueKey: "v_stp84jephrg",
                            detailCode: "组2项目一的detailCode",
                            detailName: "组2项目一",
                            formItemStruct: {
                                postscript: "组2项目一的备注",
                                config: {
                                    formItemType: "VInputNumber",
                                    disabled: true,
                                    required: true,
                                    sourceMethod: {
                                        methodType: "ComputeEqual",
                                        methodTypeParams: [
                                            "项目一的detailCode"
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
};

export {
    mockData
}