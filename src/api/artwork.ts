import {base_url} from "../config";
import axios from "axios";

export type api_artwork_output = {
    id: number
    created_at: string
    updated_at: string
    pages: number[]
    cover: string
    ti_ming: string
    zang_nian: string
    chao_dai: string
    chu_tu_di: string
    xian_cang_di: string
    hang_zi_shu: string
    chi_cun: string
    shuo_ming: string
    zu_nian: string
    nian_ling: string
    xing_bie: string
    ji_guan: string
    zhi_gai: string
    ming_wen: string
}

export let api_artwork_add_url = base_url + "/api/artwork/add"
export type api_artwork_add_input = {}
export type api_artwork_add_output = {
    msg: string
    data: {
        id: number
        created_at: string
        updated_at: string
    }
}

export function do_artwork_add_request(p_input: api_artwork_add_input): Promise<api_artwork_add_output> {
    return new Promise<api_artwork_add_output>((resolve, reject) => {
        axios.post(api_artwork_add_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    });
}

export let api_artwork_del_url = base_url + "/api/artwork/del"
export type api_artwork_del_input = {
    id: number
}
export type api_artwork_del_output = {
    msg: string
}

export function do_artwork_del_request(p_input: api_artwork_del_input): Promise<api_artwork_del_output> {
    return new Promise<api_artwork_del_output>((resolve, reject) => {
        axios.post(api_artwork_del_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    });
}

export let api_artwork_get_url = base_url + "/api/artwork/get"
export type api_artwork_get_input = {
    condition: any[]
}
export type api_artwork_get_output = {
    msg: string
    data: api_artwork_output[]
}

export function do_artwork_get_request(p_input: api_artwork_get_input): Promise<api_artwork_get_output> {
    return new Promise<api_artwork_get_output>((resolve, reject) => {
        axios.post(api_artwork_get_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    });
}

export let api_artwork_mod_url = base_url + "/api/artwork/mod"
export type api_artwork_mod_input = {
    id: number
    cover: string
    ti_ming: string
    zang_nian: string
    chao_dai: string
    chu_tu_di: string
    xian_cang_di: string
    hang_zi_shu: string
    chi_cun: string
    shuo_ming: string
    zu_nian: string
    nian_ling: string
    xing_bie: string
    ji_guan: string
    zhi_gai: string
    ming_wen: string
}
export type api_artwork_mod_output = {
    msg: string
    data: api_artwork_output
}

export function do_artwork_mod_request(p_input: api_artwork_mod_input): Promise<api_artwork_mod_output> {
    return new Promise<api_artwork_mod_output>((resolve, reject) => {
        axios.post(api_artwork_mod_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    });
}