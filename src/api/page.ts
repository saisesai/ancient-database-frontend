import {base_url} from "../config";
import axios from "axios";
import {api_char_add_output, api_char_add_url, api_char_output} from "./char";

export type api_page_output = {
    id: number
    created_at: string
    updated_at: string
    image_url: string
    artwork_id: number
    chars: number[]
}

export let api_page_add_url = base_url + "/api/page/add";

export type api_page_add_input = {
    artwork_id: number
}

export type api_page_add_output = {
    msg: string
    data: api_page_output
}

export function do_page_add_request(p_input: api_page_add_input): Promise<api_page_add_output> {
    return new Promise<api_page_add_output>((resolve, reject) => {
        axios.post(api_page_add_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    })
}

export let api_page_del_url = base_url + "/api/page/del";

export type api_page_del_input = {
    id: number
}

export type api_page_del_output = {
    msg: string
}

export function do_page_del_request(p_input: api_page_del_input): Promise<api_page_del_output> {
    return new Promise<api_page_del_output>((resolve, reject) => {
        axios.post(api_page_del_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    })
}

export let api_page_get_url = base_url + "/api/page/get";

export type api_page_get_input = {
    condition: any[]
}

export type api_page_get_output = {
    msg: string
    data: api_page_output[]
}

export function do_page_get_request(p_input: api_page_get_input): Promise<api_page_get_output> {
    return new Promise<api_page_get_output>((resolve, reject) => {
        axios.post(api_page_get_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    })
}

export let api_page_mod_url = base_url + "/api/page/mod";

export type api_page_mod_input = {
    id: number
    image_url: string
}

export type api_page_mod_output = {
    msg: string
    data: api_page_output
}

export function do_page_mod_request(p_input: api_page_mod_input): Promise<api_page_mod_output> {
    return new Promise<api_page_mod_output>((resolve, reject) => {
        axios.post(api_page_mod_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    })
}