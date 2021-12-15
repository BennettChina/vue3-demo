<template>
  <div class="address-edit-box">
    <nav-bar class="nav-bar">
      <template v-slot:default>
        {{ title }}
      </template>
    </nav-bar>

    <van-address-edit
        class="edit"
        :area-list="areaList"
        :address-info="addressInfo"
        :show-delete="type === 'edit'"
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
    />
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import {onMounted, reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {addAddress, addressDist, deleteAddress, editAddress, getAddress} from "@/network/address";
import {Toast} from "vant";

export default {
  components: {
    NavBar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      areaList: {
        province_list: {}, // 省
        city_list: {}, // 市
        county_list: {}, // 县
      },
      searchResult: [],
      addressInfo: {},
      type: "add",
      addressId: "",
      title: '',
    });
    // 挂载数据
    onMounted(() => {
      const {type, addressId} = route.query;
      state.title = type === 'add' ? '新增地址' : '编辑地址';
      state.type = type;
      state.addressId = addressId;

      addressDist.getLev1().forEach(p => {
        state.areaList.province_list[p.id] = p.text;
        addressDist.getLev2(p.id).forEach(c => {
          state.areaList.city_list[c.id] = c.text;
          addressDist.getLev3(c.id).forEach(q => {
            state.areaList.county_list[q.id] = q.text;
          })
        })
      });

      if (type === 'edit') {
        getAddress(addressId).then(res => {
          let areaCode = ''
          const province = addressDist.getLev1();
          Object.entries(state.areaList.county_list).forEach(([id, text]) => {
            // 先找出当前对应的区
            if (text === res.county) {
              // 找到区对应的几个省份
              const provinceIndex = province.findIndex(item => item.id.substr(0, 2) === id.substr(0, 2))
              // 找到区对应的几个市区
              // eslint-disable-next-line no-unused-vars
              const cityItem = Object.entries(state.areaList.city_list).filter(([cityId, city]) => cityId.substr(0, 4) === id.substr(0, 4))[0]
              // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
              if (province[provinceIndex].text === res.province && cityItem[1] === res.city) {
                areaCode = id
              }
            }
          })
          state.addressInfo = {
            name: res.name,
            tel: res.phone,
            province: res.province,
            city: res.city,
            county: res.county,
            addressDetail: res.address,
            isDefault: !!res.is_default,
            areaCode
          };
        })
      }
    });

    const onSave = (content) => {
      const address = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0
      }

      let res;
      if (state.type === 'edit') {
        res = editAddress(state.addressId, address)
      } else {
        res = addAddress(address)
      }

      res.then(() => {
        Toast.success({
          message: '保存成功',
          duration: 1000,
          onClose: () => {
            router.back();
          }
        })
      })
    }

    const onDelete = () => {
      deleteAddress(state.addressId).then(res => {
        Toast.success({
          message: '删除成功',
          duration: 1000,
          onClose: () => {
            router.back();
          }
        })
      })
    }


    return {
      ...toRefs(state),
      onSave,
      onDelete
    };
  },
};
</script>

<style lang="scss">
.edit {
  .van-field__body {
    textarea {
      height: 26px !important;
    }
  }
}

.address-edit-box {
  margin-top: 44px;

  .van-address-edit {
    .van-button--danger {
      background: var(--color-tint);
      border-color: var(--color-tint);
    }

    .van-switch--on {
      background: var(--color-tint);
    }
  }
}
</style>
