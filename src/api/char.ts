import {Region} from "./region";
import {base_url} from "../config";
import axios from "axios";

export type api_char_output = {
    id: number
    created_at: string
    updated_at: string
    page_id: number
    value: string
    region: Region
}

export let api_char_add_url = base_url + "/api/char/add";

export type api_char_add_input = {
    page_id: number
    value: string
}

export type api_char_add_output = {
    msg: string
    data: api_char_output
}

export function do_char_add_request(p_input: api_char_add_input): Promise<api_char_add_output> {
    return new Promise<api_char_add_output>((resolve, reject) => {
        axios.post(api_char_add_url, p_input,)
            .then(resp => {
                resolve(resp.data);
            }).catch(err => {
            reject(err)
        })
    });
}

export let api_char_del_url = base_url + "/api/char/del";

export type api_char_del_input = {
    id: number
}

export type api_char_del_output = {
    msg: string
}

export function do_char_del_request(p_input: api_char_del_input): Promise<api_char_del_output> {
    return new Promise<api_char_del_output>((resolve, reject) => {
        axios.post(api_char_del_url, p_input)
            .then(resp => {
                resolve(resp.data);
            })
            .catch(err => {
                reject(err)
            });
    })
}

export let api_char_get_url = base_url + "/api/char/get";

export type api_char_get_input = {
    condition: any[]
}

export type api_char_get_output = {
    msg: string
    data: api_char_output[]
}

export function do_char_get_request(p_input: api_char_get_input): Promise<api_char_get_output> {
    return new Promise<api_char_get_output>((resolve, reject) => {
        axios.post(api_char_get_url, p_input)
            .then(resp => {
                resolve(resp.data);
            })
            .catch(err => {
                reject(err)
            });
    })
}

export let api_char_mod_url = base_url + "/api/char/mod";

export type api_char_mod_input = {
    id: number
    value: string
    region: Region
}

export type api_char_mod_output = {
    msg: string
    data: api_char_output
}

export function do_char_mod_request(p_input: api_char_mod_input): Promise<api_char_mod_output> {
    return new Promise<api_char_mod_output>((resolve, reject) => {
        axios.post(api_char_mod_url, p_input)
            .then(resp => {
                resolve(resp.data);
            })
            .catch(err => {
                reject(err)
            });
    })
}