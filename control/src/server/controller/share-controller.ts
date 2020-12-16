
export namespace parse {

    export function htmlShow(obj: any) {

        return "<plaintext>" + JSON.stringify(obj, null, 2) + '\n'
    }
    
}