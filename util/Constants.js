const ENUM_STATUS = {
	ENABLE: {
		name: '启用',
		code: '1'
	},
	UNABLE: {
		name: '关闭',
		code: '0'
	},
	NOT_OBTAINED: {
		name: '未获取到信息',
		code: '2'
	},
	DELETED: {
		name: '删除',
		code: '99'
	}
}

const ENUM_GOODS_COLUMN = {
	PRICE: {
		name: '价格',
		code: 'price'
	},
	SALE_NUM: {
		name: '销售量',
		code: 'saleNum'
	}
}

const ENUM_ORDER = {
	ASC: {
		name: '正序',
		code: 'asc'
	},
	DESC: {
		name: '倒叙',
		code: 'desc'
	}
}

const ENUM_TASK_BAR = {
	CATEGORY: {
		name: '分类',
		code: 'Category'
	},
	INDEX: {
		name: '主页',
		code: 'Index'
	}
}

const ENUM_ORDER_STAUTS = {
	CANCELED: {
		name: '已取消',
		code: 0,
		index: null
	},
	UN_PAY: {
		name: '未付款',
		code: 10,
		index: 1
	},
	PAID: {
		name: '已付款',
		code: 20,
		index: 2
	},
	RETURN: {
		name: '退款/换货',
		code: 30,
		index: 4
	},
	SHIPPED: {
		name: '已发货',
		code: 40,
		index: 3
	},
	SUCCESS: {
		name: '交易成功',
		code: 50,
		index: null
	},
	CLOSED: {
		name: '已关闭',
		code: 60,
		index: 5
	},
	ALL: {
		name: '全部',
		code: 100,
		index: 0
	},
	getName (code) {
		for (let i in this) {
			if (this[i].code === code) {
				return this[i].name
			}
		}
		return ''
	}
}

const ENUM_CONFIRM_TYPE = {
	BUY: {
		name: '购买',
		code: 'buy'
	},
	CART: {
		name: '购物车',
		code: 'cart'
	}
}

const ENUM_SHIPPING_METHOD = {
	SELECT: {
		name: '请选择',
		code: 'select'
	},
	LOGITICS: {
		name: '物流托运部',
		code: 'logitics'
	},
	SF: {
		name: '顺丰',
		code: 'sf'
	},
	POSTAL: {
		name: '邮政',
		code: 'postal'
	},
	ROUND_MAIL: {
		name: '圆通',
		code: 'round_mail'
	},
	SAME_CITY_MAIL: {
		name: '同城送货',
		code: 'same_city_mail'
	},
	BUS_EXPRESS: {
		name: '大巴快运',
		code: 'bus_express'
	},
	PICK_UP: {
		name: '自提',
		code: 'pick_up'
	}
}


export { ENUM_STATUS, ENUM_GOODS_COLUMN, ENUM_ORDER, ENUM_TASK_BAR, ENUM_ORDER_STAUTS, ENUM_CONFIRM_TYPE, ENUM_SHIPPING_METHOD }
