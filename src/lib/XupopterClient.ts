import type IRecipe from "src/models/IRecipe";
import { storage } from "src/storage";

const getURI = async () : Promise<URL> => {
    const data = await storage.get();
    return new URL(data.xupopterClient);
}

const query = async (route : string, params?, method : string = 'get') => {
    const uri = await getURI();

    let request = {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + uri.username,
        }
    };
    let paramList;

    // json body or already a FormData
    if (params instanceof FormData || params instanceof URLSearchParams) {
        paramList = params;
    } else if (typeof params === "string") {
        request.headers['Accept'] = 'application/json';
        request.headers['Content-Type'] = 'application/json';
        paramList = params;
    } else {
        if (method === 'post') {
            paramList = new FormData();
        } else {
            paramList = new URLSearchParams();
        }

        for (let k in params) {
            if (!params.hasOwnProperty(k)) {continue;}
            paramList.append(k, params[k]);
        }
    }

    if (method === "post") {
        // @ts-ignore
        request.body = paramList;
    } else {
        route = route + "?" + paramList;
    }

    let response = await fetch(uri.origin + "/api/" + route, request);
    response = await response.json();

    return response;
}

export const saveRecipe = async (recipe: IRecipe) => {
    await query("recipes", JSON.stringify(recipe), 'post');
}