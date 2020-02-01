function getTableId(url) {
	let id = undefined
	if(url.includes('/d/')){
		id = url.slice(url.indexOf('/d/') + 3, url.indexOf('/edit'));
	}else if(url.includes('id=')){
		id = url.slice(url.indexOf('id=') + 3);
	}
	console.log(id);
	return id;
}

function getUrlParams(search) {
    let hashes = search.slice(search.indexOf('?') + 1).split('&')
    let params = {}
    hashes.map(hash => {
        let [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })
    return params
}