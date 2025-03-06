// 

import FilterLastDays from "./TimesTools/filterLastDays.js"

export default class DataTools{
	constructor() {
		new FilterLastDays(5);
		new FilterLastDays(15);
    }
}