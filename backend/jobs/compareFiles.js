const fs = require('fs');
const natural = require('natural');
const levenshtein = require('fast-levenshtein'); 
const crypto = require('crypto');

function preprocessCode(code) {
    code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    code = code.replace(/\s+/g, ' ').trim();
    return code.split(/\s+/); 
}

function calculateFingerprinting(tokens, chunkSize = 5) {
    const fingerprints = [];
    for (let i = 0; i <= tokens.length - chunkSize; i++) {
        const chunk = tokens.slice(i, i + chunkSize).join(' ');
        const hash = crypto.createHash('sha256').update(chunk).digest('hex'); 
        fingerprints.push(hash);
    }
    return fingerprints;
}

function calculateFingerprintSimilarity(fingerprintsA, fingerprintsB) {
    const setA = new Set(fingerprintsA);
    const setB = new Set(fingerprintsB);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    return intersection.size / Math.min(setA.size, setB.size);
}


function calculateWinnowing(tokens, chunkSize = 5, windowSize = 4) {
    const fingerprints = calculateFingerprinting(tokens, chunkSize);
    const winnowed = [];
    let minHashIndex = 0;

    for (let i = 0; i <= fingerprints.length - windowSize; i++) {
        const window = fingerprints.slice(i, i + windowSize);
        const minHash = Math.min(...window);
        const minHashPos = i + window.indexOf(minHash);

        if (winnowed.length === 0 || winnowed[winnowed.length - 1] !== minHashPos) {
            winnowed.push(minHashPos);
        }
    }
    return winnowed;
}

function calculateWinnowingSimilarity(winnowedA, winnowedB) {
    const setA = new Set(winnowedA);
    const setB = new Set(winnowedB);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    return intersection.size / Math.min(setA.size, setB.size);
}

const zlib = require('zlib'); // For compression

function compressData(data) {
    return zlib.deflateSync(data).length;
}

function calculateNCD(codeA, codeB) {
    const compressedA = compressData(codeA);
    const compressedB = compressData(codeB);
    const combinedCompressed = compressData(codeA + codeB);

    return (combinedCompressed - Math.min(compressedA, compressedB)) /
        Math.max(compressedA, compressedB);
}



function calculateJaccardSimilarity(tokensA, tokensB) {
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
}

function calculateCosineSimilarity(tokensA, tokensB) {
    const freqA = getFrequency(tokensA);
    const freqB = getFrequency(tokensB);

    const uniqueTokens = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    uniqueTokens.forEach(token => {
        const countA = freqA[token] || 0;
        const countB = freqB[token] || 0;

        dotProduct += countA * countB;
        magA += countA ** 2;
        magB += countB ** 2;
    });

    return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

function calculateLevenshteinSimilarity(codeA, codeB) {
    const distance = levenshtein.get(codeA, codeB);
    const maxLength = Math.max(codeA.length, codeB.length);
    return 1 - distance / maxLength; }

function getFrequency(tokens) {
    return tokens.reduce((freq, token) => {
        freq[token] = (freq[token] || 0) + 1;
        return freq;
    }, {});
}

function preprocessCode(code) {
    code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); 
    code = code.replace(/\s+/g, ' ').trim(); 
    return code.split(/\s+/); 
}

function greedyStringTiling(tokensA, tokensB) {
    const matches = new Set();
    const markedA = new Array(tokensA.length).fill(false);
    const markedB = new Array(tokensB.length).fill(false);

    let tileLength = 1;
    while (tileLength > 0) {
        tileLength = 0;
        for (let i = 0; i < tokensA.length; i++) {
            for (let j = 0; j < tokensB.length; j++) {
                if (!markedA[i] && !markedB[j] && tokensA[i] === tokensB[j]) {
                    let length = 0;
                    while (
                        i + length < tokensA.length &&
                        j + length < tokensB.length &&
                        tokensA[i + length] === tokensB[j + length] &&
                        !markedA[i + length] &&
                        !markedB[j + length]
                    ) {
                        length++;
                    }
                    if (length > tileLength) {
                        tileLength = length;
                        for (let k = 0; k < length; k++) {
                            markedA[i + k] = true;
                            markedB[j + k] = true;
                            matches.add(`${i + k}-${j + k}`);
                        }
                    }
                }
            }
        }
    }
    const matchedTokens = matches.size;
    const totalTokens = Math.max(tokensA.length, tokensB.length);
    return matchedTokens / totalTokens;
}


function compareFiles(file1Path, file2Path) {
    const code1 = fs.readFileSync(file1Path, 'utf8');
    const code2 = fs.readFileSync(file2Path, 'utf8');

    const tokens1 = preprocessCode(code1);
    const tokens2 = preprocessCode(code2);

    const jaccard = calculateJaccardSimilarity(tokens1, tokens2);
    const cosine = calculateCosineSimilarity(tokens1, tokens2);
    const levenshtein = calculateLevenshteinSimilarity(code1, code2);
    const gst = greedyStringTiling(tokens1, tokens2);


    const fingerprints1 = calculateFingerprinting(tokens1);
    const fingerprints2 = calculateFingerprinting(tokens2);
    const fingerprintSimilarity = calculateFingerprintSimilarity(fingerprints1, fingerprints2);
    const winnowed1 = calculateWinnowing(tokens1);
    const winnowed2 = calculateWinnowing(tokens2);
    const winnowingSimilarity = calculateWinnowingSimilarity(winnowed1, winnowed2);
    const ncd = 1 - calculateNCD(code1, code2); 

    const averageSimilarity = (
        jaccard +
        cosine +
        levenshtein +
        gst +
        fingerprintSimilarity +
        winnowingSimilarity +
        ncd
    ) / 7;

    console.log(`Jaccard Similarity: ${(jaccard * 100).toFixed(2)}%`);
    console.log(`Cosine Similarity: ${(cosine * 100).toFixed(2)}%`);
    console.log(`Levenshtein Similarity: ${(levenshtein * 100).toFixed(2)}%`);
    console.log(`GST Similarity: ${(gst * 100).toFixed(2)}%`);
    console.log(`Fingerprint Similarity: ${(fingerprintSimilarity * 100).toFixed(2)}%`);
    console.log(`Winnowing Similarity: ${(winnowingSimilarity * 100).toFixed(2)}%`);
    console.log(`NCD Similarity: ${(ncd * 100).toFixed(2)}%`);
    console.log(`Average Similarity: ${(averageSimilarity * 100).toFixed(2)}%`);

    return averageSimilarity;
}

module.exports = { compareFiles };