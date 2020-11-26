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
	NOT_PHONE_NUM: {
		name: '未获取到手机信息',
		code: '3'
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
		index: null
	},
	RETURN_4_SEARCH: {
		name: '售后申请搜索',
		code: 120,
		index: 4
	},
	AGREE_TO_REFUND: {
		name: '同意售后',
		code: 32,
		index: null
	},
	RETURN_CONFIRM: {
		name: '确认售后',
		code: 70
	},
	WAIT_RETURN: {
		name: '等待退回',
		code: 72
	},
	RETURNED: {
		name: '售后完成',
		code: 80,
		index: null
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
			if (this[i].code == code) {
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
	MOTOR_BIKE: {
		name: '摩托车',
		code: 'motor_bike'
	},
	PICK_UP: {
		name: '自提',
		code: 'pick_up'
	}
}

const ENUM_RE_TYPE = {
	NORMAL: {
		name: '正常',
		code: 10
	},
	REQ_RETURN: {
		name: '申请退货',
		code: 20
	},
	RETURN: {
		name: '退货',
		code: 25
	},
	REQ_EXCHANG: {
		name: '换货申请',
		code: 30
	},
	EXCHANGE: {
		name: '换货',
		code: 35
	},
	TEMPORALLY_NOT_SHIPPED: {
		name: '暂不发货',
		code: 40
	},
	// REFUND: {
	// 	name: '退货',
	// 	code: 'refund'
	// },
	// CHANGE: {
	// 	name: '换货',
	// 	code: 'exchange'
	// },
	getName (code) {
		for (let i in this) {
			if (this[i].code === code) {
				return this[i].name
			}
		}
		return ''
	}
}


export {
	ENUM_STATUS,
	ENUM_GOODS_COLUMN,
	ENUM_ORDER,
	ENUM_TASK_BAR,
	ENUM_ORDER_STAUTS,
	ENUM_CONFIRM_TYPE,
	ENUM_SHIPPING_METHOD,
	ENUM_RE_TYPE
}
