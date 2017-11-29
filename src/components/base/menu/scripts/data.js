import Mock from 'mockjs';
export default Mock.mock('menu.html', {
    "array": [
        {
            name: "monitor",
            text: "在途监控",
            icon: "monitor",
            children: [
                {
                    name: "home",
                    text: "工作台",
                    icon: "home",
                    children: []
                }, {
                    name: "permiss",
                    text: "管理权限",
                    icon: "ios-list-outline",
                    children: [
                        {
                            name: "role",
                            text: "角色管理",
                            children: []
                        }, {
                            name: "users",
                            text: "用户管理",
                            children: []
                        }
                    ]
                }, {
                    name: "map",
                    text: "监控管理",
                    icon: "map",
                    children: [
                        {
                            name: "realtime",
                            text: "实时监控"
                        }, {
                            name: "playback",
                            text: "轨迹回放"
                        }, {
                            name: "fence",
                            text: "围栏管理"
                        }, {
                            name: "fenceevent",
                            text: "围栏事件"
                        }
                    ]
                }
            ]
        }
    ]
});