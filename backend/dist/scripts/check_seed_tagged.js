"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
function loadEnv(envPath) {
    if (!fs.existsSync(envPath))
        return;
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m)
            return;
        let [, key, val] = m;
        if (val.startsWith('"') && val.endsWith('"'))
            val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'"))
            val = val.slice(1, -1);
        process.env[key] = val;
    });
}
async function main() {
    loadEnv(path.resolve(__dirname, '..', '..', '.env'));
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found.');
        process.exit(1);
    }
    const seedTag = process.argv[2];
    if (!seedTag) {
        console.error('Provide seedTag as first argument');
        process.exit(1);
    }
    await mongoose.connect(uri, { dbName: 'edupro' });
    const conn = mongoose.connection;
    const collections = ['users', 'studentprofiles', 'classgroups', 'grades', 'timetableentries', 'invoices', 'institutions'];
    for (const c of collections) {
        try {
            const count = await conn.collection(c).countDocuments({ seededBy: seedTag });
            console.log(`${c} seededBy ${seedTag}: ${count}`);
        }
        catch (err) {
            console.log(`${c}: error - ${err.message}`);
        }
    }
    await mongoose.disconnect();
    process.exit(0);
}
main().catch((err) => { console.error('check failed', err); process.exit(1); });
//# sourceMappingURL=check_seed_tagged.js.map