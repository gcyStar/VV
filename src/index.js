/**
 * Created by chunyang.gao on 17/4/14.
 */
import VVInit from './validator.js'


function install (Vue, opts) {
    VVInit(Vue, opts)
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.Vue) {
    if (!install.installed) install(window.Vue)
}

export default install
