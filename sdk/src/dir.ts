import RAM from './ram'
import { INode, DirINode, Dir, BSVKeyPair, NETWORK } from "./types";
import bsv from 'bsv'
import Reader from './reader'

export default class DirINode extends Reader implements IDirINode {
    key: BSVKeyPair
    iNode: DirINode
    dirs: Dir[]

    constructor (key: BSVKeyPair) {
        super()
        if (!key) {
            throw new Error("Cannot create dir without associated key!")
        }

        this.key = key
        this.refresh()
    }

    /**
     * Re-Fetches and parses the inode and data associated with this dir 
     */
    refresh () {
        let pubkey = this.key.hdPublicKey.publicKey
        let addr = new bsv.Address(pubkey, NETWORK, 'pubkey')
        
        let data = RAM.getLastTxData(addr)


        this.iNode.mode = this.readInt(data, 2)
        this.iNode.bitcom_id = data.slice(2, 22)
        this.iNode.size = this.readInt(data.slice(23), 8)
        this.iNode.child_count = this.readInt(data.slice(31), 4)
        this.iNode.record_count = this.readInt(data.slice(35), 4)
        
        this.parseEntries(data.slice(39))
    }

    createDir () {

    }

    addDynEntry (ptr: string ) {

    }

    addStatEntry (ptr) {

    }
    
    removeEntry (name) {
        // Just refresh in case we missed something in that period of time
        this.refresh()
    }

    private parseEntries(data: Uint8Array) {
        for (var i = 0; i < this.iNode.record_count; i++) {
            // TODO: parse Folder entry,
            // Push folder entry
        }
    }
}