import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GIST_URL = "https://gist.githubusercontent.com/Keshava11/aace79cf260e7955ac1768d3ad6e24bd/raw/districts_block_map.json";

const stateMap = {
    "1": "Andhra Pradesh",
    "2": "Assam",
    "3": "Bihar",
    "4": "Gujarat",
    "5": "Haryana",
    "6": "Himachal Pradesh",
    "7": "Jammu and Kashmir",
    "8": "Karnataka",
    "9": "Kerala",
    "10": "Madhya Pradesh",
    "11": "Maharashtra",
    "12": "Manipur",
    "13": "Meghalaya",
    "14": "Mizoram",
    "15": "Nagaland",
    "16": "Odisha",
    "17": "Punjab",
    "18": "Rajasthan",
    "19": "Sikkim",
    "20": "Tamil Nadu",
    "21": "Tripura",
    "22": "Uttar Pradesh",
    "23": "West Bengal",
    "24": "Andaman and Nicobar Islands",
    "25": "Chandigarh",
    "26": "Dadra and Nagar Haveli",
    "27": "Daman and Diu",
    "28": "Delhi",
    "29": "Lakshadweep",
    "30": "Puducherry",
    "31": "Goa",
    "32": "Arunachal Pradesh",
    "33": "Chhattisgarh",
    "34": "Jharkhand",
    "35": "Uttarakhand",
    "36": "Telangana"
};

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    try {
        console.log("Fetching data from Gist...");
        const gistData = await fetchJSON(GIST_URL);

        const statesDict = {};
        const consolidated = { states: [] };

        gistData.forEach(item => {
            const sCode = item.stateCode;
            const sName = stateMap[sCode] || `State ${sCode}`;

            if (!statesDict[sName]) {
                statesDict[sName] = { name: sName, districts: [] };
                consolidated.states.push(statesDict[sName]);
            }

            const districtName = (item.name || "Unknown District").toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            statesDict[sName].districts.push({
                name: districtName,
                mandals: (item.blockList || []).sort()
            });
        });

        // Sort states and districts
        consolidated.states.sort((a, b) => a.name.localeCompare(b.name));
        consolidated.states.forEach(state => {
            state.districts.sort((a, b) => a.name.localeCompare(b.name));
        });

        const outputPath = path.join(__dirname, '..', 'src', 'data', 'locations.json');
        fs.writeFileSync(outputPath, JSON.stringify(consolidated, null, 4));
        console.log(`Successfully generated ${outputPath}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
