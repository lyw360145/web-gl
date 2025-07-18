import { useUserStore } from '@/store';
import { isLogin } from '@/api/user'
import comfirm from "@/components/comfirm";
import { bodyMountDom } from "@/components/comfirm";
import { isMobile, getYearMonthDay } from '@/util';
import axios from '@/api/request';
import NProgress from 'nprogress';
import { Modal } from '@arco-design/web-vue';


const igroneList = ['submitApp', 'joinRace'];
const igroneListAi = ['pdfViewMember', 'memberOrder'];
const igroneListCertificateList = ['enterpriseCertification'];


let vmFeedback = null;

const makeFeedback = (router, to) => {

    if (vmFeedback !== null) {

        const parent = vmFeedback.parentNode;
        parent.removeChild(vmFeedback);
        vmFeedback = null;

    }
    if (!igroneListAi.includes(to.name)) {
        vmFeedback = bodyMountDom({
            router,
            type: 'feedback',
            axios: axios,
            routeName: to.name

        })
    }


}
export default function createRouteGuard(router) {
    router.beforeEach(async(to, from, next) => {
        const lang = from.query.lang
        NProgress.start();

        if (isMobile() && igroneList.includes(to.name)) {
            comfirm({
                type: 'MobileTip',
                title: '提示',
                confirmText: '报名成功',
                src: '/marine-technology/assets/img/mobile-tip.png',
                onConfirm: () => {},
                onGoNext: () => {
                    router.go(-1)
                }
            })
        }
        const userStore = useUserStore();
        makeFeedback(router, to);


        if (to.path === '/login') {
            next()

        } else {
            if (!userStore.isLogin) {
                const res = await isLogin();
                if (res.result) {

                    const res = await axios.get('/ocean_api/main/passwordExpire');
                    if (res.result) {
                        Modal.warning({
                            title: '提示',
                            content: '密码过期，请去修改密码！',
                            maskClosable: false,
                            onOk: () => {
                                window.open(`${window.origin}/ocean/user-main/individual-info`);
                            }
                        });
                        return;
                    }
                    await userStore.info();
                    await userStore.setIsLogin(true)
                    if (userStore.isLogin && !igroneListCertificateList.includes(to.name) && !userStore.userInfo.enterprise) {
                        const isOpen = getYearMonthDay() !== window.localStorage.getItem('update') ? true : false;
                        if (!window.localStorage.getItem('update') || isOpen) {
                            comfirm({
                                type: 'CustomMessage',
                                title: '当前账号未认证',
                                description: '当前账号未进行企业认证，暂时无法使用平台全部功能，如发布需求、参与报名、等级产品挂牌上架及购买产品'

                            })
                        }

                    }
                }
            }
            // if (to.name === 'consultDetail' && to.query.orgCode) {
            //     next({
            //         name: 'consultDetailNew',
            //         query: {
            //             ...to.query
            //         },
            //         params: {
            //             ...to.params
            //         }
            //     });
            // } else {
            if (lang && to.query.lang !== lang) {
                next({
                    ...to,
                    query: {
                        ...to.query,
                        lang
                    },
                    replace: true // 避免历史堆叠
                })
            } else {
                next()
            }
            // }

        }
        NProgress.done();
    })
}