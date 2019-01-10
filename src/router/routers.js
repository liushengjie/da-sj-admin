import Main from '@/view/main'

export default [{
		path: '/login',
		name: 'login',
		meta: {
			title: 'Login - 登录',
			hideInMenu: true
		},
		component: () =>
			import('@/view/login/login.vue')
	},
	{
		path: '/',
		name: 'index',
		redirect: '/home',
		component: Main,
		meta: {
			hideInMenu: true,
			notCache: true,
			title: '首页',
		},
		children: [{
			path: 'home',
			name: '首页',
			meta: {
				hideInMenu: true,
				notCache: true,
				title: '首页',
			},
			component: () =>
				import('@/view/home')
		}]
	},
	{
		path: '/dataSource',
		name: 'dataSource',
		meta: {
			icon: 'ios-browsers',
			title: '源管理',
			notCache: true
		},
		component: Main,
		redirect:'dataSource/manager',
		children: [{
			path: 'manager',
			name: 'dsManager',
			meta: {
				hideInMenu: true,
				notCache: true
			},
			component: () =>
				import('@/view/dataSource/index')
		}]
	},
	{
		path: '/dataRepo',
		name: 'dataRepo',
		meta: {
			icon: 'ios-browsers',
			title: '数据仓库(治理)',
			notCache: true
		},
		component: Main,
		redirect:'dataRepo/manager',
		children: [{
			path: 'manager',
			name: 'drManager',
			meta: {
				hideInMenu: true,
				notCache: true
			},
			component: () =>
				import('@/view/dataRepo/index')
		}]
	},
	{
		path: '/resource',
		name: 'resource',
		meta: {
			icon: 'logo-buffer',
			title: '资源库',
			notCache: true
		},
		component: Main,
		redirect:'resource/manager',
		children: [{
			path: 'manager',
			name: 'resManager',
			meta: {
				hideInMenu: true,
				notCache: true
			},
			component: () =>
				import('@/view/resource/index')
		}]
	},{
		path: '/service',
		name: 'service',
		meta: {
			icon: 'md-albums',
			title: '服务库',
			notCache: true
		},
		component: Main,
		redirect:'service/manager',
		children: [{
			path: 'manager',
			name: 'serviceManager',
			meta: {
				hideInMenu: true,
				notCache: true
			},
			component: () =>
				import('@/view/service/index')
		}]
	},{
		path: '/dict',
		name: 'dict',
		meta: {
			icon: 'ios-list-box',
			title: '字典管理',
			notCache: true
		},
		component: Main,
		redirect:'dict/manager',
		children: [{
			path: 'manager',
			name: 'dictManager',
			meta: {
				hideInMenu: true,
				notCache: true
			},
			component: () =>
				import('@/view/dict/index')
		}]
	},{
		path: '/monitor',
		name: 'monitor',
		meta: {
			icon: 'ios-pulse-outline',
			title: '系统监控',
			notCache: true
		},
		component: Main,
		redirect:'monitor/manager',
		children: [{
			path: 'manager',
			name: 'qualityMonitor',
			meta: {
				notCache: true,
				title: '质量监控',
			},
			component: () =>
				import('@/view/service/index')
		},{
			path: 'manager',
			name: 'serviceMonitor',
			meta: {
				notCache: true,
				title: '服务监控',
			},
			component: () =>
				import('@/view/service/index')
		},
		{
			path: 'manager',
			name: 'taskMonitor',
			meta: {
				notCache: true,
				title: '任务监控',
			},
			component: () =>
				import('@/view/service/index')
		}]
	},{
		path: '/log',
		name: 'log',
		meta: {
			icon: 'logo-codepen',
			title: '日志管理',
			notCache: true
		},
		component: Main,
		redirect:'service/manager',
		children: [{
			path: 'manager',
			name: 'logManager',
			meta: {
				hideInMenu: true,
				notCache: true
			},
			component: () =>
				import('@/view/service/index')
		}]
	},
	{
		path: '/401',
		name: 'error_401',
		component: () =>
			import('@/view/error-page/401.vue')
	},
	{
		path: '/500',
		name: 'error_500',
		component: () =>
			import('@/view/error-page/500.vue')
	},
	{
		path: '*',
		name: 'error_404',
		component: () =>
			import('@/view/error-page/404.vue')
	}
]
