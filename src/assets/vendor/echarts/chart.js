
    // based on prepared DOM, initialize echarts instance
    var mixChart = echarts.init(document.getElementById('mix-chart'));
    var pieChart1 = echarts.init(document.getElementById('pie-chart1'));
    var pieChart2 = echarts.init(document.getElementById('pie-chart2'));
    var pieChart3 = echarts.init(document.getElementById('pie-chart3'));

    var barChart1 = echarts.init(document.getElementById('bar-chart1'));
    var barChart2 = echarts.init(document.getElementById('bar-chart2'));


    var mixChartOption = {
        textStyle: {
            fontFamily: 'sans-serif'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        //color: ['#F75850', '#3376C4', '#08AF41', '#ee6666'],
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            data: ['Lượt yêu cầu', 'Lượt hỗ trợ', 'Thiết bị']
        },
        xAxis: [
            {
                type: 'category',
                data: ['01/09', '02/09', '03/09', '04/09', '05/09', '06/09', '07/09', '08/09', '09/09', '10/09', '11/09', '12/09', '13/09', '14/09', '15/09'],
                axisPointer: {
                    type: 'shadow'
                },
                tooltip:{
                    show: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Lượt yêu cầu/hỗ trợ',
                min: 0,
                max: 180, // lấy max Thiết bị + 20
                interval: 20,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: 'Thiết bị',
                min: 0,
                max: 180, // lấy max Thiết bị + 20
                interval: 20,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: 'Lượt yêu cầu',
                type: 'bar',
                //showBackground: true,
                //backgroundStyle:{
                //    color: "#EE4420"
                //},
                data: [60.0, 55.0, 110.0, 90, 85, 76, 115, 130, 145, 120, 90, 125, 120, 140, 160]
            },
            {
                name: 'Lượt hỗ trợ',
                type: 'bar',
                data: [20.0, 49.0, 80.0, 62, 50, 70, 80, 40, 80, 75, 95, 120, 110, 145, 110]
            },
            {
                name: 'Thiết bị',
                type: 'line',
                yAxisIndex: 1,
                data: [45, 49.0, 85.0, 150.0, 120, 110, 120, 80, 140, 90, 120, 145, 110, 160, 140]
            }
        ]
    };

    optionPieChart1 = {
        textStyle: {
            fontFamily: 'sans-serif'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Thiết bị',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                    normal : {
                        label : {
                           show: true, position: 'inner',
                           formatter : function (params){
                                 return  params.percent + '%\n'
                           },
                       },
                       labelLine : {
                           show : false
                       }
                   },
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '25',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1000, name: 'Laptop'},
                    {value: 735, name: 'Tablet'},
                    {value: 580, name: 'Desktop'},
                ]
            }
        ]
    };

    optionPieChart2 = {
        textStyle: {
            fontFamily: 'sans-serif'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Số lượt đăng ký',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                    normal : {
                        label : {
                           show: true, position: 'inner',
                           formatter : function (params){
                                 return  params.percent + '%\n'
                           },
                       },
                       labelLine : {
                           show : false
                       }
                   },
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '25',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 750, name: 'Cá nhân'},
                    {value: 75, name: 'Tổ chức'},
                ]
            }
        ]
    };

    optionPieChart3 = {
        textStyle: {
            fontFamily: 'sans-serif'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Trạng thái yêu cầu',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                    normal : {
                        label : {
                           show: true, position: 'inner',
                           formatter : function (params){
                                 return  params.percent + '%\n'
                           },
                       },
                       labelLine : {
                           show : false
                       }
                   },
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '25',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1250, name: 'Yêu cầu'},
                    {value: 735, name: 'Hỗ trợ'},
                ]
            }
        ]
    };

    var optionBarChart1 = {
        textStyle: {
            fontFamily: 'sans-serif'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['Số lượng cần hỗ trợ', 'Số lượng được hỗ trợ']
        },
        //color: ['rgb(255,55,129)', 'rgb(164,97,240)'],
        calculable: true,
        xAxis: [{
            axisLabel: { interval: 0, rotate: 30 },
            type: 'category',
            data: ['Hồ Chí Minh', 'Vĩnh Long', 'Long An', 'Cần Thơ', 'Phú Yên', 'Bình Phước', 'Lâm Đồng']
        }],
        yAxis: [{
            type: 'value'
        }],
        series:[
            {
                name: 'Số lượng cần hỗ trợ',
                type: 'bar',
                data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                fontWeight: 500
                            }
                        }
                    }
                },
                //markLine: {
                  //  data: [{type: 'average', name: 'Average'}]
                //}
            },
            {
                name: 'Số lượng được hỗ trợ',
                type: 'bar',
                data: [rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd()],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                fontWeight: 500
                            }
                        }
                    }
                },
                // markLine: {
                //    data: [{type: 'average', name: 'Average'}]
                // }
            }
        ]
    };

    var optionBarChart2 = {
        textStyle: {
            fontFamily: 'sans-serif'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['Số lượng cần hỗ trợ', 'Số lượng được hỗ trợ']
        },
        //color: ['rgb(255,55,129)', 'rgb(164,97,240)'],
        calculable: true,
        xAxis: [{
            axisLabel: { interval: 0, rotate: 30 },
            type: 'category',
            data: ['Phát động tháng nhân đạo năm 2021', 'Chung tay hỗ trợ học tập cho học sinh nghèo', 'Kết nối triệu trái tim', 'Vì miền Trung thân thương']
        }],
        yAxis: [{
            type: 'value'
        }],
        series:[
            {
                name: 'Số lượng cần hỗ trợ',
                type: 'bar',
                data: [rd(), rd(), rd(), rd()],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                fontWeight: 500
                            }
                        }
                    }
                },
                //markLine: {
                  //  data: [{type: 'average', name: 'Average'}]
                //}
            },
            {
                name: 'Số lượng được hỗ trợ',
                type: 'bar',
                data: [rd(), rd(), rd(), rd()],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                fontWeight: 500
                            }
                        }
                    }
                },
                // markLine: {
                //    data: [{type: 'average', name: 'Average'}]
                // }
            }
        ]
    };

    // use configuration item and data specified to show chart
    //myChart.setOption(option);
    mixChart.setOption(mixChartOption);
    pieChart1.setOption(optionPieChart1);
    pieChart2.setOption(optionPieChart2);
    pieChart3.setOption(optionPieChart3);
    barChart1.setOption(optionBarChart1);
    barChart2.setOption(optionBarChart2);
    // Resize chart on menu width change and window resize
    $(window).on('resize', resize);
    //$(".menu-toggle").on('click', resize);

    //Resize function
    function resize() {
        setTimeout(function() {

            // Resize chart
            mixChart.resize();
            pieChart1.resize();
            pieChart2.resize();
            pieChart3.resize();
            barChart1.resize();
            barChart2.resize();
        }, 200);
    }


function rd(){ 
    return Math.round(Math.random()*100);
};

