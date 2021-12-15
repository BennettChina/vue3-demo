import {
    Swipe, SwipeItem, Lazyload, Badge, Sidebar, SidebarItem, Collapse, CollapseItem, Tab as VanTab
    , Tabs, Card, Image as VanImage, Tag, Button, Form, Field, CellGroup, Checkbox, CheckboxGroup
    , SwipeCell, Stepper, SubmitBar, Icon, AddressList, AddressEdit, List, PullRefresh, Popup, Grid, GridItem
} from 'vant';

export default (app) => {
    app.use(Swipe)
        .use(SwipeItem)
        .use(Lazyload, {
            loading: require('@img/default.png')
        })
        .use(Sidebar)
        .use(SidebarItem)
        .use(Collapse)
        .use(CollapseItem)
        .use(Badge)
        .use(VanTab)
        .use(Tabs)
        .use(Card)
        .use(VanImage)
        .use(Tag)
        .use(Button)
        .use(Form)
        .use(Field)
        .use(CellGroup)
        .use(Checkbox)
        .use(CheckboxGroup)
        .use(SwipeCell)
        .use(Stepper)
        .use(SubmitBar)
        .use(Icon)
        .use(AddressList)
        .use(AddressEdit)
        .use(List)
        .use(Popup)
        .use(PullRefresh)
        .use(Grid)
        .use(GridItem)
}
