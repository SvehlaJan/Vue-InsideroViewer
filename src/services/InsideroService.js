export async function getOffers(countryId, regionId, cityId, propertyType) {
    const params = {
        country: countryId,
        region: regionId,
        city: cityId,
        type: propertyType,
        offer: "sell",
        active: "true",
        limit: "100",
        page: "1",
        sortBy: "id",
        sortOrder: "desc"
    }
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
    const paramsStr = new URLSearchParams(params).toString();
    const path = "/offers" + (paramsStr ? `?${paramsStr}` : "")
    const response = await fetch(path);
    return await response.json();
}

export async function getCountries() {
    const path = "/countries"
    const response = await fetch(path,);
    return await response.json();
}

export async function getRegions(country) {
    const params = {
        country: country,
    }
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
    const paramsStr = new URLSearchParams(params).toString();
    const path = "/regions" + (paramsStr ? `?${paramsStr}` : "")
    const response = await fetch(path,);
    return await response.json();
}

export async function getCities(country, region, query) {
    const params = {
        country: country,
        region: region,
        query: query,
    }
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);
    const paramsStr = new URLSearchParams(params).toString();
    const path = "/cities" + (paramsStr ? `?${paramsStr}` : "")
    const response = await fetch(path,);
    return await response.json();
}

export async function updateCategoryCall(payload) {
    const response = await fetch(`/offers`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        mode: 'cors'
    })
    return await response.json();
}