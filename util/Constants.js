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


export { ENUM_STATUS, ENUM_GOODS_COLUMN, ENUM_ORDER, ENUM_TASK_BAR }
