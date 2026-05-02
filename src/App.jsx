import { useState, useEffect, useMemo } from 'react'

/* ── THEME ── */
const BL="#3b82f6", SK="#0ea5e9", CY="#06b6d4"
const N="#050d1a", N2="#08111f", N3="#0d1f35"
const BD="#1e3a5f", TX="#e2e8f0", MU="#64748b", DM="#94a3b8"
const GD="#fbbf24", GR="#10b981", RD="#ef4444"

const ADMIN_EMAIL = "amalroy3962@gmail.com"
const ADMIN_PASS  = "Arthur@1729"

/* ── STORAGE (localStorage wrapper) ── */
const store = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
  del: (k) => { try { localStorage.removeItem(k) } catch {} },
}

/* ── 100 MOLECULES ── */
const MOLS = [
  {id:1,name:"Amyloid-β 1-42",sn:"Aβ42",type:"Amyloid",seq:"DAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIA",pdb:"2BEG",cond:"pH 7.4, 37°C, PBS",disease:"Alzheimer's disease",meth:"ssNMR, TEM, AFM",doi:"10.1073/pnas.0506723102",ref:"Lührs T et al., PNAS 2005, 102:17342",notes:"Major amyloidogenic peptide; parallel in-register β-sheet fibrils. Core of Alzheimer's senile plaques."},
  {id:2,name:"Amyloid-β 1-40",sn:"Aβ40",type:"Amyloid",seq:"DAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVV",pdb:"2LFM",cond:"pH 7.2, 37°C, PBS",disease:"Alzheimer's disease",meth:"ssNMR, TEM",doi:"10.1021/ja003197v",ref:"Petkova AT et al., JACS 2002, 124:2228",notes:"Predominant Aβ isoform found in cerebral vasculature."},
  {id:3,name:"Aβ16-22 (KLVFFAE)",sn:"KLVFFAE",type:"Amyloid",seq:"KLVFFAE",pdb:null,cond:"pH 5–7, 40% MeCN/water",disease:"Alzheimer's disease",meth:"ssNMR, CD",doi:"10.1021/bi000987v",ref:"Balbach JJ et al., Biochemistry 2000, 39:13748",notes:"Core β-sheet nucleation motif; antiparallel arrangement."},
  {id:4,name:"Aβ25-35",sn:"Aβ25-35",type:"Amyloid",seq:"GSNKGAIIGLM",pdb:null,cond:"pH 7.4, 37°C",disease:"Alzheimer's disease",meth:"TEM, AFM, CD",doi:"10.1074/jbc.271.52.33589",ref:"Pike CJ et al., JBC 1996, 271:33589",notes:"Neurotoxic fragment widely used in cell toxicity assays."},
  {id:5,name:"Tau PHF6 (VQIVYK)",sn:"PHF6",type:"Amyloid",seq:"VQIVYK",pdb:"3OVL",cond:"pH 7.4, HEPES buffer",disease:"Alzheimer's disease",meth:"ssNMR, X-ray, MicroED",doi:"10.1073/pnas.0107180098",ref:"von Bergen M et al., PNAS 2001, 98:9873",notes:"Core nucleation segment R3 of tau PHF; steric zipper structure."},
  {id:6,name:"Tau PHF6* (VQIINK)",sn:"PHF6*",type:"Amyloid",seq:"VQIINK",pdb:"3Q2X",cond:"pH 7.4, PBS",disease:"Alzheimer's disease",meth:"MicroED, X-ray",doi:"10.1126/science.1218031",ref:"Sawaya MR et al., Nature 2007, 447:453",notes:"R2 core tau segment; class 1 steric zipper."},
  {id:7,name:"α-Synuclein (full length)",sn:"α-Syn",type:"Amyloid",seq:"MDVFMKGLSKAKEGVVAAAEKTK… (140 aa)",pdb:"2N0A",cond:"pH 7.4, 37°C, HEPES, shaking",disease:"Parkinson's disease",meth:"CryoEM, ssNMR, TEM",doi:"10.1038/nature01303",ref:"Tuttle MD et al., Nat Struct Mol Biol 2016, 23:409",notes:"Major Lewy body component; Greek-key protofilament fold."},
  {id:8,name:"α-Syn NAC domain (71-82)",sn:"α-Syn NAC",type:"Amyloid",seq:"GGAVVTGVTAVA",pdb:null,cond:"pH 7.4, PBS, 37°C",disease:"Parkinson's disease",meth:"NMR, TEM, CD",doi:"10.1021/bi952221s",ref:"Uéda K et al., PNAS 1993, 90:11282",notes:"Non-Aβ component; drives aggregation nucleation."},
  {id:9,name:"IAPP / Amylin (1-37)",sn:"IAPP",type:"Amyloid",seq:"KCNTATCATQRLANFLVHSSNNFGAILSSTNVGSNTY",pdb:"2L86",cond:"pH 7.4, 37°C, lipid membranes",disease:"Type 2 Diabetes",meth:"ssNMR, TEM, CryoEM",doi:"10.1073/pnas.0400085101",ref:"Luca S et al., Biochemistry 2007, 46:13505",notes:"Pancreatic amyloid polypeptide; disrupts β-cell membranes."},
  {id:10,name:"IAPP20-29 (SNNFGAILSS)",sn:"IAPP20-29",type:"Amyloid",seq:"SNNFGAILSS",pdb:null,cond:"pH 7.0, aqueous, 37°C",disease:"Type 2 Diabetes",meth:"TEM, CD, FTIR",doi:"10.1021/bi9506494",ref:"Westermark P et al., PNAS 1990, 87:5036",notes:"Minimum fibrillogenic fragment of IAPP."},
  {id:11,name:"NFGAIL (IAPP22-27)",sn:"NFGAIL",type:"Amyloid",seq:"NFGAIL",pdb:"1RW2",cond:"pH 7.0, 37°C",disease:"Type 2 Diabetes",meth:"X-ray, TEM",doi:"10.1073/pnas.0401346101",ref:"Zheng J et al., Biophys J 2011, 100:1534",notes:"Shortest amyloidogenic IAPP fragment; steric zipper."},
  {id:12,name:"PrP106-126",sn:"PrP106",type:"Amyloid",seq:"KTNMKHMAGAAAAGAVVGGLG",pdb:null,cond:"pH 7.4, 37°C, SDS",disease:"Prion disease",meth:"TEM, CD, NMR",doi:"10.1038/362543a0",ref:"Forloni G et al., Nature 1993, 362:543",notes:"Neurotoxic PrP fragment; β-sheet fibrils in vitro."},
  {id:13,name:"HET-s(218-289) prion",sn:"HET-s",type:"Amyloid",seq:"Podospora anserina HET-s domain",pdb:"2KJ3",cond:"pH 7.0, MES buffer, 25°C",disease:"Fungal prion (functional)",meth:"ssNMR, TEM",doi:"10.1038/nature06725",ref:"Wasmer C et al., Science 2008, 319:1523",notes:"Triangular hydrophobic core β-solenoid; paradigm functional amyloid."},
  {id:14,name:"GNNQQNY (Sup35 7-13)",sn:"GNNQQNY",type:"Amyloid",seq:"GNNQQNY",pdb:"1YJP",cond:"pH 7.0, aqueous/DMSO",disease:"Yeast prion [PSI+]",meth:"MicroED, X-ray",doi:"10.1126/science.1125141",ref:"Nelson R et al., Nature 2005, 435:773",notes:"Archetypal steric zipper; first crystal structure of amyloid spine."},
  {id:15,name:"TDP-43 LCD (274-313)",sn:"TDP-43 LCD",type:"Aggregation",seq:"GNNQGSSNMPVHLKAVNEATNAGNGGQ…",pdb:"2N3X",cond:"pH 6.0, low-salt, 25°C",disease:"ALS / FTD",meth:"NMR, TEM, MicroED",doi:"10.1016/j.cell.2016.08.026",ref:"Murthy AC et al., Nat Struct Mol Biol 2021, 28:318",notes:"Low-complexity domain; LLPS precedes pathological fibril."},
  {id:16,name:"FUS LCD (1-163)",sn:"FUS LCD",type:"Aggregation",seq:"MASNDYTQQATQSYGAYPTQPGQGY…",pdb:"5W3N",cond:"pH 7.4, low ionic strength",disease:"ALS / FTD",meth:"NMR, MicroED",doi:"10.1016/j.cell.2018.03.070",ref:"Murray DT et al., Cell 2017, 171:615",notes:"Prion-like LCD; smectic liquid crystal organization in fibrils."},
  {id:17,name:"SOD1 A4V mutant",sn:"SOD1-A4V",type:"Aggregation",seq:"Mutant Cu/Zn SOD (153 aa)",pdb:"2C9V",cond:"pH 7.0, reduced metal, 37°C",disease:"Familial ALS",meth:"X-ray, TEM, NMR",doi:"10.1073/pnas.1705978114",ref:"Rosen DR et al., Nature 1993, 362:59",notes:"Most aggressive fALS mutation; dimer interface disrupted."},
  {id:18,name:"Polyglutamine Q44",sn:"PolyQ44",type:"Amyloid",seq:"QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",pdb:null,cond:"pH 7.4, PBS, 37°C",disease:"Huntington's disease",meth:"ssNMR, TEM, FCS",doi:"10.1021/ja0718423",ref:"Bhattacharyya A et al., JACS 2006, 128:4490",notes:"Pathological polyQ threshold; β-sheet-rich fibrillar structure."},
  {id:19,name:"Transthyretin (TTR) WT",sn:"TTR",type:"Amyloid",seq:"Human TTR tetramer (127 aa)",pdb:"1TTA",cond:"pH 4.0–5.5, 37°C",disease:"Familial amyloid polyneuropathy",meth:"X-ray, TEM, NMR",doi:"10.1126/science.1079547",ref:"Colon W & Kelly JW, Biochemistry 1992, 31:8654",notes:"Acid-dissociated monomer misassembles; tafamidis binds T4 pocket."},
  {id:20,name:"β2-Microglobulin (1-99)",sn:"β2m",type:"Amyloid",seq:"Human β2-microglobulin (99 aa)",pdb:"2XKU",cond:"pH 2.5–3.5, 37°C, Cu²⁺",disease:"Dialysis amyloidosis",meth:"NMR, TEM, AFM",doi:"10.1093/hmg/ddh095",ref:"Eakin CM et al., Biochemistry 2004, 43:7808",notes:"Accumulates in joints of haemodialysis patients."},
  {id:21,name:"Serum Amyloid A (1-76)",sn:"SAA1-76",type:"Amyloid",seq:"Acute phase SAA N-terminal fragment",pdb:"6MST",cond:"pH 7.4, physiological",disease:"AA amyloidosis",meth:"CryoEM, TEM",doi:"10.1126/science.aaw2075",ref:"Liberta F et al., eLife 2019, 8:e46574",notes:"Systemic amyloidosis from chronic inflammation."},
  {id:22,name:"Lysozyme I56T mutant",sn:"Lys-I56T",type:"Amyloid",seq:"Mutant human lysozyme (130 aa)",pdb:"1LOZ",cond:"pH 4.0, 57°C, GuHCl partial",disease:"Hereditary systemic amyloidosis",meth:"NMR, X-ray",doi:"10.1038/35070530",ref:"Pepys MB et al., Nature 2001, 410:476",notes:"Single mutation reduces thermal stability ~7°C."},
  {id:23,name:"Calcitonin (salmon sCT)",sn:"sCT",type:"Amyloid",seq:"CSNLSTCVLGKLSQELHKLQTYPRTNTGSGTP",pdb:null,cond:"pH 4.0, 37°C, acetic acid",disease:"Medullary thyroid carcinoma",meth:"TEM, CD, FTIR",doi:"10.1021/bi981659g",ref:"Kanaori K & Nosaka AY, Biochemistry 1995, 34:12138",notes:"Antiparallel β-sheet fibrils; used as osteoporosis drug."},
  {id:24,name:"Diphenylalanine (FF)",sn:"FF",type:"Self-Assembly",seq:"Phe-Phe",pdb:null,cond:"Aqueous HFP/water, 2–5 mM, 25°C",disease:"None (nanotechnology)",meth:"TEM, AFM, XRD",doi:"10.1126/science.1082387",ref:"Reches M & Gazit E, Science 2003, 300:625",notes:"Landmark discovery: π-stacking driven peptide nanotubes."},
  {id:25,name:"Fmoc-Diphenylalanine",sn:"Fmoc-FF",type:"Self-Assembly",seq:"Fmoc-Phe-Phe",pdb:null,cond:"pH 7.0–8.0, 2–4 mM, aqueous",disease:"None (biomaterial)",meth:"TEM, CD, Rheology, SAXS",doi:"10.1039/b918426h",ref:"Smith AM et al., Adv Mater 2008, 20:37",notes:"Hydrogelator via Fmoc π-stacking + hydrogen bonding."},
  {id:26,name:"RADA16-I scaffold",sn:"RADA16-I",type:"Self-Assembly",seq:"RADARADARADARADA",pdb:null,cond:"5–10 mM NaCl, pH 7.0",disease:"None (tissue scaffold)",meth:"AFM, TEM, CD",doi:"10.1073/pnas.1437168100",ref:"Zhang S et al., PNAS 2003, 100:5756",notes:"Ionic-complementary self-assembly into 3D nanofiber scaffold."},
  {id:27,name:"KLD-12 peptide scaffold",sn:"KLD-12",type:"Self-Assembly",seq:"KLDLKLDLKLDL",pdb:null,cond:"pH 7.4, aqueous, low ionic",disease:"None (cartilage scaffold)",meth:"AFM, CD, FTIR",doi:"10.1073/pnas.1836564100",ref:"Kisiday J et al., PNAS 2002, 99:9996",notes:"Supports chondrocyte culture; cartilage tissue engineering."},
  {id:28,name:"EAK16-II peptide",sn:"EAK16-II",type:"Self-Assembly",seq:"AEAEAKAKAEAEAKAK",pdb:null,cond:"pH 7.0, low ionic strength",disease:"None (nanotechnology)",meth:"TEM, AFM, CD",doi:"10.1073/pnas.93.21.11648",ref:"Zhang S et al., PNAS 1993, 90:3334",notes:"First designed ionic self-assembling peptide."},
  {id:29,name:"MAX1 β-hairpin hydrogel",sn:"MAX1",type:"Self-Assembly",seq:"VKVKVKVKVDPPTKVKVKVKV",pdb:null,cond:"pH 7.4, PBS, 150 mM NaCl",disease:"None (biomaterial)",meth:"CD, Rheology, TEM",doi:"10.1021/la000157x",ref:"Schneider JP et al., JACS 2002, 124:15030",notes:"Folding-triggered β-hairpin hydrogelation."},
  {id:30,name:"Q11 vaccine scaffold",sn:"Q11",type:"Self-Assembly",seq:"QQKFQFQFEQQ",pdb:null,cond:"pH 7.4, PBS, 25°C",disease:"None (vaccine adjuvant)",meth:"TEM, CD, SAXS",doi:"10.1021/nn100658n",ref:"Rudra JS et al., ACS Nano 2010, 4:3925",notes:"Nanofibers that stimulate immune response."},
  {id:31,name:"Fmoc-RGD hydrogel",sn:"Fmoc-RGD",type:"Self-Assembly",seq:"Fmoc-Arg-Gly-Asp",pdb:null,cond:"pH 7.4, 10 mM, aqueous",disease:"None (tissue engineering)",meth:"TEM, CD, Rheology",doi:"10.1039/c0sm00527d",ref:"Jayawarna V et al., Adv Mater 2006, 18:611",notes:"Integrin-binding bioactive hydrogel."},
  {id:32,name:"GCN4-p1 leucine zipper",sn:"GCN4-p1",type:"Self-Assembly",seq:"RMKQLEDKVEELLSKNYHLENEVARLKKLVGER",pdb:"2ZTA",cond:"pH 7.0, PBS, 20°C",disease:"None (structural model)",meth:"X-ray, CD, AUC",doi:"10.1126/science.8346484",ref:"O'Shea EK et al., Science 1991, 254:539",notes:"Paradigm coiled-coil; first leucine zipper crystal structure."},
  {id:33,name:"Collagen triple helix (GPO)10",sn:"(GPO)10",type:"Self-Assembly",seq:"GPOGPOGPOGPOGPOGPOGPOGPOGPOGPO",pdb:"1CAG",cond:"pH 7.0, 4–37°C",disease:"None (biomaterial model)",meth:"X-ray, CD, TEM",doi:"10.1021/ja027001",ref:"Rele S et al., JACS 2007, 129:14780",notes:"GPO repeat forms stable triple helix; models native collagen."},
  {id:34,name:"KFFE nanotube peptide",sn:"KFFE",type:"Self-Assembly",seq:"KFFE",pdb:null,cond:"Aqueous, 1–10 mM, pH 7",disease:"None (nanotechnology)",meth:"TEM, FTIR, CD",doi:"10.1021/jp0503751",ref:"Hartgerink JD et al., PNAS 2002, 99:5133",notes:"Antiparallel β-sheet nanotube assembly."},
  {id:35,name:"Sup35 NM prion domain",sn:"Sup35-NM",type:"Amyloid",seq:"PQGGYQQYNPDGGYQQYNPQ… (254 aa)",pdb:"2KHM",cond:"pH 7.0, spontaneous or seeded",disease:"Yeast prion [PSI+]",meth:"ssNMR, TEM, AFM",doi:"10.1126/science.1098507",ref:"Wickner RB et al., Science 2004, 304:1518",notes:"Epigenetically heritable prion; PQGGYQQYN repeat domain."},
  {id:36,name:"NNQQNY hexapeptide",sn:"NNQQNY",type:"Amyloid",seq:"NNQQNY",pdb:"1YJO",cond:"pH 7.0, buffer/DMSO",disease:"Yeast prion",meth:"X-ray, MicroED",doi:"10.1073/pnas.0501798102",ref:"Balbirnie M et al., PNAS 2001, 98:2375",notes:"Self-complementary steric zipper; paired β-sheets."},
  {id:37,name:"VEALYL (insulin B11-17)",sn:"VEALYL",type:"Amyloid",seq:"VEALYL",pdb:"1RW2",cond:"pH 2.0, 60°C",disease:"Insulin injection amyloidosis",meth:"X-ray, TEM",doi:"10.1073/pnas.0311454101",ref:"Ivanova MI et al., PNAS 2004, 101:10584",notes:"Steric zipper from insulin B-chain core."},
  {id:38,name:"β-Lactoglobulin amyloid",sn:"β-LG",type:"Amyloid",seq:"Bovine β-lactoglobulin (162 aa)",pdb:null,cond:"pH 2.0, 90°C, 5 h, shaking",disease:"None (food science model)",meth:"AFM, TEM, FTIR, CD",doi:"10.1021/bi0486520",ref:"Akkermans C et al., J Agric Food Chem 2008, 56:2090",notes:"Worm-like fibrils in food science context."},
  {id:39,name:"A6K surfactant peptide",sn:"A6K",type:"Self-Assembly",seq:"AAAAAAK",pdb:null,cond:"Aqueous, 5–40 mM, pH 7",disease:"None (nanotechnology)",meth:"TEM, AFM, SAXS",doi:"10.1039/b307249a",ref:"Zhao X et al., Biomacromolecules 2010, 11:2874",notes:"Surfactant-like; β-sheet nanofibers via hydrophobic collapse."},
  {id:40,name:"MAX8 β-hairpin hydrogel",sn:"MAX8",type:"Self-Assembly",seq:"VKVKVKVKVDPPTKVEVKVKV",pdb:null,cond:"pH 7.4, PBS, 37°C",disease:"None (biomaterial)",meth:"Rheology, TEM, CD",doi:"10.1002/smll.200500375",ref:"Yucel T et al., Biophys J 2009, 97:2044",notes:"Glutamate substitution; stiffer gel than MAX1."},
  {id:41,name:"IKVAV peptide amphiphile",sn:"PA-IKVAV",type:"Self-Assembly",seq:"C16-VVVAAAKK-IKVAV",pdb:null,cond:"PBS, Ca²⁺/Na⁺ trigger, pH 7.4",disease:"None (neural scaffold)",meth:"TEM, CD, SAXS",doi:"10.1073/pnas.2120745118",ref:"Silva GA et al., Science 2004, 303:1352",notes:"Peptide amphiphile for spinal cord injury repair."},
  {id:42,name:"Fmoc-GG hydrogel",sn:"Fmoc-GG",type:"Self-Assembly",seq:"Fmoc-Gly-Gly",pdb:null,cond:"pH 5.0–8.0, 1–10 mM",disease:"None (material)",meth:"TEM, CD, FTIR",doi:"10.1039/c2sc20631g",ref:"Fleming S et al., Chem Sci 2013, 4:2953",notes:"Simplest Fmoc-dipeptide hydrogel."},
  {id:43,name:"Ure2p yeast prion (1-65)",sn:"Ure2p",type:"Amyloid",seq:"Nitrogen catabolite repressor domain",pdb:"1HXR",cond:"pH 7.0, spontaneous, 25°C",disease:"Yeast prion [URE3]",meth:"TEM, ssNMR",doi:"10.1016/j.cell.2005.04.031",ref:"Wickner RB, Science 1994, 264:566",notes:"Prion domain drives [URE3] inheritance."},
  {id:44,name:"YIGSR laminin fragment",sn:"YIGSR",type:"Self-Assembly",seq:"YIGSR",pdb:null,cond:"pH 7.4, physiological saline",disease:"None (neural scaffold)",meth:"CD, SPR",doi:"10.1021/bm100064y",ref:"Tashiro KI et al., JBC 1989, 264:16174",notes:"β-1 integrin-binding motif; promotes neurite outgrowth."},
  {id:45,name:"Apolipoprotein A-I (1-93)",sn:"ApoA-I",type:"Amyloid",seq:"N-terminal fragment of apolipoprotein A-I",pdb:"6UJE",cond:"pH 7.0, lipid-depleted",disease:"Familial apolipoprotein amyloidosis",meth:"CryoEM, TEM",doi:"10.1073/pnas.1807913116",ref:"Del Giudice R et al., Sci Rep 2019, 9:2679",notes:"Oxidative conditions expose amyloidogenic region."},
  {id:46,name:"Medin amyloid fragment",sn:"Medin",type:"Amyloid",seq:"Lactadherin C2 fragment aa 50-70",pdb:null,cond:"pH 7.4, 37°C, aortic tissue",disease:"Aortic medial amyloidosis",meth:"AFM, MS, IHC",doi:"10.1093/hmg/9.17.2513",ref:"Häggqvist B et al., PNAS 1999, 96:8669",notes:"Most common human amyloid; >90% of individuals >50 yr."},
  {id:47,name:"Atrial natriuretic factor (1-28)",sn:"ANF",type:"Amyloid",seq:"SLRRSSSCFGGRMDRIGAQSGLGCNSFRY",pdb:null,cond:"pH 5.0, 37°C, heparin",disease:"Cardiac atrial amyloidosis",meth:"TEM, CD",doi:"10.1042/bj3210647",ref:"Benson MD et al., Ann Intern Med 1986, 105:193",notes:"Isolated atrial amyloid deposits in elderly."},
  {id:48,name:"Cystatin C L68Q mutant",sn:"Cys-C",type:"Amyloid",seq:"Mutant human cystatin C (120 aa)",pdb:"1TIJ",cond:"pH 7.0, 37°C",disease:"Hereditary cerebral amyloid angiopathy",meth:"NMR, X-ray",doi:"10.1006/jmbi.2001.4778",ref:"Janowski R et al., Nat Struct Biol 2001, 8:316",notes:"Domain-swapped dimer precursor to amyloid fibril."},
  {id:49,name:"Spider silk MaSp1 repeat",sn:"MaSp1",type:"Self-Assembly",seq:"GGAGQGGYGGLGSQGAGRGGQGAGAAAAAGGAGQ",pdb:null,cond:"Aqueous, pH 5.5–7.0, spin dope",disease:"None (biomaterial)",meth:"NMR, WAXS, AFM",doi:"10.1021/la7020577",ref:"Savage KN et al., Biomacromolecules 2008, 9:1037",notes:"β-nanocrystalline motif of dragline silk (Nephila clavipes)."},
  {id:50,name:"Silk fibroin (GAGAGS)6",sn:"GAGAGS",type:"Self-Assembly",seq:"GAGAGSGAGAGSGAGAGSGAGAGSGAGAGSGAGAGS",pdb:null,cond:"Aqueous, methanol-induced crystallization",disease:"None (biomaterial)",meth:"XRD, AFM, FTIR",doi:"10.1002/mabi.200600062",ref:"Mandal BB & Kundu SC, Biomaterials 2008, 29:2979",notes:"β-sheet crystalline domain of Bombyx mori silk."},
  {id:51,name:"Elastin-like polypeptide (VPGXG)n",sn:"ELP",type:"Self-Assembly",seq:"VPGVGVPGVGVPGVGVPGVG (repeat)",pdb:null,cond:"PBS, LCST 25–40°C",disease:"None (drug delivery)",meth:"DLS, NMR, SAXS",doi:"10.1039/b703726b",ref:"Urry DW, Prog Biophys Mol Biol 1992, 57:23",notes:"Thermoresponsive inverse phase transition; nanocoacervates."},
  {id:52,name:"Boc-FF nanotube",sn:"Boc-FF",type:"Self-Assembly",seq:"Boc-Phe-Phe-OH",pdb:null,cond:"Cyclohexane, vapor-deposition",disease:"None (nanotechnology)",meth:"AFM, SEM, TEM",doi:"10.1039/c0cc03635h",ref:"Adler-Abramovich L et al., Nat Nanotechnol 2006, 1:195",notes:"Piezoelectric nanotubes; semiconductor nanotechnology."},
  {id:53,name:"Cyclo-FF diketopiperazine",sn:"Cyclo-FF",type:"Self-Assembly",seq:"cyclo(Phe-Phe)",pdb:null,cond:"Ethanol/water mixture",disease:"None (nanotechnology)",meth:"TEM, XRD, CD",doi:"10.1039/c2ob26560h",ref:"Yan X et al., ACS Nano 2010, 4:5020",notes:"Nanotube from diketopiperazine scaffold; high stability."},
  {id:54,name:"FKFEFKFE β-sheet peptide",sn:"FKFEFKFE",type:"Self-Assembly",seq:"FKFEFKFE",pdb:null,cond:"PBS, pH 7.0–7.4",disease:"None (scaffold)",meth:"CD, TEM, AFM",doi:"10.1021/bi990375d",ref:"Caplan MR et al., Biomacromolecules 2000, 1:627",notes:"Alternating charged β-sheet amphiphilic peptide."},
  {id:55,name:"KLVFF (Aβ16-20)",sn:"KLVFF",type:"Amyloid",seq:"KLVFF",pdb:null,cond:"pH 7.4, aqueous, mM range",disease:"Alzheimer's disease",meth:"TEM, CD, FTIR",doi:"10.1002/anie.200462600",ref:"Tjernberg LO et al., JBC 1996, 271:8545",notes:"Minimum Aβ fibril nucleation and inhibitor fragment."},
  {id:56,name:"Aβ42 Arctic mutant (E22G)",sn:"Aβ42-E22G",type:"Amyloid",seq:"DAEFRHDSGYEVHHQKLVFFAGDVGSNKGAIIGLMVGGVVIA",pdb:null,cond:"pH 7.4, 37°C",disease:"Early-onset Alzheimer's",meth:"TEM, AFM, ThT kinetics",doi:"10.1038/nn.2002",ref:"Nilsberth C et al., Nat Neurosci 2001, 4:887",notes:"Accelerated fibrillation; disrupts KLVFF interaction."},
  {id:57,name:"Aβ42 Iowa mutant (D23N)",sn:"Aβ42-D23N",type:"Amyloid",seq:"DAEFRHDSGYEVHHQKLVFFAENVGSNKGAIIGLMVGGVVIA",pdb:null,cond:"pH 7.4, 37°C",disease:"Alzheimer's (Iowa variant)",meth:"ssNMR, TEM",doi:"10.1073/pnas.0906783106",ref:"Tycko R et al., Biochemistry 2009, 48:6345",notes:"Antiparallel β-sheet fibril; distinct from WT parallel structure."},
  {id:58,name:"FUS RGG domain (37-97)",sn:"FUS-RGG",type:"Aggregation",seq:"RGGGGRGQGGRGRGGGRGQGG… (repeat)",pdb:null,cond:"Low salt, pH 7.4, 4°C",disease:"ALS / FTD",meth:"NMR, LLPS assay",doi:"10.1016/j.cell.2018.03.070",ref:"Qamar S et al., Cell 2018, 173:720",notes:"Cation-π interactions drive liquid-liquid phase separation."},
  {id:59,name:"hnRNPA2 LCD (G298S)",sn:"A2-LCD",type:"Aggregation",seq:"Prion-like LCD of hnRNPA2B1",pdb:"5WYR",cond:"pH 7.0, low salt, 25°C",disease:"ALS / IBM / FTD",meth:"NMR, MicroED",doi:"10.1016/j.cell.2018.03.070",ref:"Ryan VH et al., Cell 2018, 175:966",notes:"G298S mutation converts LLPS droplet to fibril."},
  {id:60,name:"Tau R2 repeat domain",sn:"Tau-R2",type:"Amyloid",seq:"KVQIINKKLDLSNVQSKCGSKDNIKHVPG",pdb:null,cond:"pH 6.8, heparin, 37°C",disease:"Alzheimer's / PSP",meth:"ssNMR, TEM",doi:"10.1021/ja074454x",ref:"Andronesi OC et al., JACS 2008, 130:5922",notes:"R2 repeat contributes to 4R tau isoform filaments."},
  {id:61,name:"GAIIGLM (Aβ29-35)",sn:"GAIIGLM",type:"Amyloid",seq:"GAIIGLM",pdb:null,cond:"pH 7.4, acetonitrile/water",disease:"Alzheimer's disease",meth:"MicroED, TEM",doi:"10.7554/eLife.68154",ref:"Gremer L et al., Science 2017, 358:116",notes:"Hydrophobic C-terminal fibril segment; steric zipper."},
  {id:62,name:"Tau fibril core AD (306-378)",sn:"Tau-AD",type:"Amyloid",seq:"VQIVYKPVDLSKVTSKCGSLGNIHHKPGG… (72 aa)",pdb:"5O3L",cond:"Human Alzheimer brain-derived",disease:"Alzheimer's disease",meth:"CryoEM",doi:"10.1038/nature23002",ref:"Fitzpatrick AWP et al., Nature 2017, 547:185",notes:"First atomic model of brain-derived tau filaments from AD."},
  {id:63,name:"α-Syn MSA strain",sn:"α-Syn MSA",type:"Amyloid",seq:"Full-length α-synuclein (140 aa)",pdb:"7MXO",cond:"Brain-derived from MSA patient",disease:"Multiple System Atrophy",meth:"CryoEM",doi:"10.1038/s41586-021-03232-3",ref:"Schweighauser M et al., Nature 2020, 585:464",notes:"MSA fibril fold distinct from PD; different protofilament interface."},
  {id:64,name:"TDP-43 ALS fibril core",sn:"TDP-43 core",type:"Amyloid",seq:"TDP-43 fibril core (aa 311-360)",pdb:"7KWZ",cond:"ALS brain-derived",disease:"ALS / FTD",meth:"CryoEM",doi:"10.1038/s41594-021-00580-w",ref:"Arseni D et al., Nat Struct Mol Biol 2022, 29:142",notes:"CryoEM structure directly from ALS patient brain tissue."},
  {id:65,name:"Bovine insulin amyloid",sn:"BvIns",type:"Amyloid",seq:"Bovine insulin hexamer → fibril (51 aa)",pdb:null,cond:"pH 2.0, 65°C, 500 rpm stirring",disease:"Injection-site amyloidosis",meth:"ssNMR, TEM",doi:"10.1016/j.jmb.2011.06.024",ref:"Pappalardo G et al., Biopolymers 2010, 93:732",notes:"Model for pharmaceutical insulin aggregation."},
  {id:66,name:"Fmoc-Phe-OH gelator",sn:"Fmoc-F",type:"Self-Assembly",seq:"Fmoc-Phe",pdb:null,cond:"Water/DMSO, pH switch 10→4",disease:"None (supramolecular)",meth:"XRD, TEM, CD",doi:"10.1039/c2ob26560h",ref:"Chen L et al., Chem Commun 2010, 46:6738",notes:"pH-switchable single-component gel; worm-like micelles."},
  {id:67,name:"Pyrene-Ala2 hydrogel",sn:"Pyr-AA",type:"Self-Assembly",seq:"Pyrene-Ala-Ala conjugate",pdb:null,cond:"pH 7.4, aqueous, 25°C",disease:"None (material)",meth:"CD, TEM, Fluorescence",doi:"10.1021/la100817t",ref:"Mba M et al., Org Lett 2010, 12:3496",notes:"Excimer-forming pyrene nanofibers; blue fluorescence."},
  {id:68,name:"Gelsolin D187N mutant",sn:"Gelsolin",type:"Amyloid",seq:"Actin-remodeling protein (80 kDa)",pdb:"1H1V",cond:"pH 4.0–5.5, furin cleavage",disease:"Finnish hereditary amyloidosis",meth:"X-ray, TEM",doi:"10.1038/ng0294-151",ref:"Maury CP, J Intern Med 1991, 229:83",notes:"Aberrant proteolysis releases amyloidogenic 8 kDa fragment."},
  {id:69,name:"PEG-b-KLVFF nanoparticle",sn:"PEG-KLVFF",type:"Self-Assembly",seq:"PEG-KLVFF conjugate",pdb:null,cond:"PBS, amphiphilic self-assembly",disease:"Alzheimer's (therapeutic NP)",meth:"DLS, TEM, NMR",doi:"10.1021/bm8011686",ref:"Caplan MR et al., Biomacromolecules 2002, 3:663",notes:"Nanoparticle that sequesters and inhibits Aβ aggregation."},
  {id:70,name:"WFF tripeptide nanostructure",sn:"WFF",type:"Self-Assembly",seq:"Trp-Phe-Phe",pdb:null,cond:"Aqueous, 1–5 mM",disease:"None (nanotechnology)",meth:"TEM, CD, Fluorescence",doi:"10.1039/c7sc04542e",ref:"Adler-Abramovich L et al., Angew Chem 2012, 51:6423",notes:"Tryptophan promotes blue luminescent nanotubes."},
  {id:71,name:"Fibrinogen Aα chain (526-555)",sn:"Fib-Aα",type:"Amyloid",seq:"GVYYRSGSYSKQFTSSTSYNRGDSTFESKS",pdb:null,cond:"pH 7.0, 37°C",disease:"Hereditary renal amyloidosis",meth:"AFM, TEM, MS",doi:"10.1042/bj20070247",ref:"Higuchi K et al., J Biochem 2002, 132:559",notes:"Variant Aα chain; renal failure from fibrillar deposits."},
  {id:72,name:"Fmoc-FGG tripeptide",sn:"Fmoc-FGG",type:"Self-Assembly",seq:"Fmoc-Phe-Gly-Gly",pdb:null,cond:"pH 7.0–8.0, 1–5 mM",disease:"None (biomaterial)",meth:"TEM, CD, SAXS",doi:"10.1039/b918426h",ref:"Smith AM et al., Adv Mater 2008, 20:37",notes:"Extended Fmoc-tripeptide hydrogelator."},
  {id:73,name:"Rnq1p prion domain",sn:"Rnq1p",type:"Amyloid",seq:"Rnq1p C-terminal prion-like domain",pdb:null,cond:"pH 7.0, spontaneous or [PIN+]",disease:"Yeast prion [RNQ+]",meth:"TEM, AFM",doi:"10.1016/j.cell.2005.04.031",ref:"Derkatch IL et al., Cell 1997, 89:811",notes:"[PIN+] element potentiates [PSI+] induction."},
  {id:74,name:"V6K surfactant peptide",sn:"V6K",type:"Self-Assembly",seq:"VVVVVVK",pdb:null,cond:"Aqueous, 0.5–5 mM",disease:"None (nanotechnology)",meth:"TEM, CD, SAXS",doi:"10.1039/c1sc00338k",ref:"Zhao X et al., Biomacromolecules 2010, 11:2874",notes:"Stronger hydrophobic core than A6K; nanotubes vs nanofibers."},
  {id:75,name:"MVGGVVIA (Aβ30-37)",sn:"Aβ30-37",type:"Amyloid",seq:"MVGGVVIA",pdb:null,cond:"pH 7.0, TFE/water",disease:"Alzheimer's disease",meth:"ssNMR, TEM",doi:"10.1021/ja0607095",ref:"Petkova AT et al., Science 2005, 307:262",notes:"C-terminal hydrophobic Aβ fragment; parallel β-sheets."},
  {id:76,name:"Tau R1 fragment (273-284)",sn:"Tau-R1",type:"Amyloid",seq:"VQIINKKLDLSN",pdb:null,cond:"pH 6.8, 37°C",disease:"Alzheimer's / 3R-FTD",meth:"ssNMR, TEM",doi:"10.1126/science.1218031",ref:"Fitzpatrick AWP et al., Nature 2017, 547:185",notes:"R1 repeat in 3R tau isoform; CryoEM-determined core."},
  {id:77,name:"Cholesterol-KLVFF conjugate",sn:"Chol-KLVFF",type:"Self-Assembly",seq:"Cholesterol-KLVFF",pdb:null,cond:"PBS, self-assembly into vesicles",disease:"Alzheimer's (amyloid inhibitor)",meth:"TEM, DLS",doi:"10.1002/anie.200900761",ref:"Goeden-Wood NL et al., J Pept Sci 2009, 15:461",notes:"Amphiphilic Aβ inhibitor via KLVFF recognition."},
  {id:78,name:"Fmoc-FRGDF hydrogel",sn:"Fmoc-FRGDF",type:"Self-Assembly",seq:"Fmoc-Phe-Arg-Gly-Asp-Phe",pdb:null,cond:"pH 4→7 transition, aqueous",disease:"None (biomaterial)",meth:"TEM, FTIR, CD",doi:"10.1039/b915561c",ref:"Mahler A et al., Adv Mater 2006, 18:1365",notes:"Aromatic Fmoc + RGD integrin motif hydrogel."},
  {id:79,name:"New1 prion domain (1-153)",sn:"New1",type:"Amyloid",seq:"New1 Ala-rich prion-like domain",pdb:null,cond:"pH 7.0, yeast cytoplasm",disease:"Yeast prion [NEW+]",meth:"TEM, NMR",doi:"10.1038/emboj.2010.65",ref:"Alberti S et al., PNAS 2009, 106:7786",notes:"Novel yeast prion; identified via prediction algorithm."},
  {id:80,name:"IAPP + POPC/POPG membrane",sn:"IAPP-lipid",type:"Amyloid",seq:"KCNTATCATQRLANFLVHSSNNFGAILSSTNVGSNTY",pdb:null,cond:"pH 7.4, POPC/POPG bilayer 7:3",disease:"Type 2 Diabetes",meth:"ssNMR, CryoTEM",doi:"10.1073/pnas.0400085101",ref:"Williamson JA et al., Biochemistry 2009, 48:2114",notes:"Lipid membrane dramatically accelerates IAPP nucleation."},
  {id:81,name:"α-Syn (45-67) segment",sn:"α-Syn45-67",type:"Amyloid",seq:"GVVHGVATVAEKTKEQVTNVGG",pdb:null,cond:"pH 7.4, agitation, 37°C",disease:"Parkinson's disease",meth:"NMR, CD",doi:"10.1073/pnas.0602669103",ref:"Bhak G et al., Sci Rep 2018, 8:5745",notes:"Central region contributing to α-Syn amyloid core."},
  {id:82,name:"Lysozyme D67H mutant",sn:"Lys-D67H",type:"Amyloid",seq:"D67H mutant human lysozyme (130 aa)",pdb:"1LYY",cond:"pH 5.0, 50°C",disease:"Hereditary systemic amyloidosis",meth:"NMR, X-ray",doi:"10.1038/35070530",ref:"Pepys MB et al., Nature 2001, 410:476",notes:"Significantly reduced thermal stability; widespread fibril deposits."},
  {id:83,name:"WK dipeptide nanofibers",sn:"WK",type:"Self-Assembly",seq:"Trp-Lys",pdb:null,cond:"Aqueous, 1–10 mM",disease:"None (nanotechnology)",meth:"TEM, Fluorescence, CD",doi:"10.1039/c1sc00338k",ref:"Adler-Abramovich L et al., Angew Chem 2012, 51:6423",notes:"Dipeptide nanofiber; antimicrobial activity demonstrated."},
  {id:84,name:"Ac-IKVAV neural peptide",sn:"IKVAV-pep",type:"Self-Assembly",seq:"Ac-IKVAV-OH",pdb:null,cond:"PBS, pH 7.4, physiological",disease:"None (spinal cord repair)",meth:"TEM, CD, AFM",doi:"10.1073/pnas.2120745118",ref:"Alvarez Z et al., Science 2021, 374:848",notes:"PA-IKVAV nanofibers rescue locomotion in SCI model."},
  {id:85,name:"Aβ(11-25) central domain",sn:"Aβ11-25",type:"Amyloid",seq:"EVHHQKLVFFAEDVG",pdb:null,cond:"pH 5.8, aqueous, 25°C",disease:"Alzheimer's disease",meth:"NMR, CD",doi:"10.1021/bi990375d",ref:"Kohno T et al., Biochemistry 1996, 35:16094",notes:"β-sheet propensity in central hydrophilic region of Aβ."},
  {id:86,name:"KTTKS pentapeptide",sn:"KTTKS",type:"Self-Assembly",seq:"KTTKS",pdb:null,cond:"PBS, pH 7.4",disease:"None (wound healing)",meth:"NMR, CD",doi:"10.1021/bm100064y",ref:"Katayama K et al., Br J Dermatol 1993, 129:95",notes:"Procollagen-derived; palmitoyl form used in cosmetics."},
  {id:87,name:"Pal-VKTTKS lipopeptide",sn:"Pal-VKTTKS",type:"Self-Assembly",seq:"Palmitoyl-Val-Lys-Thr-Thr-Lys-Ser",pdb:null,cond:"Aqueous, pH 7.0, micellar",disease:"None (anti-aging)",meth:"DLS, TEM, NMR",doi:"10.1021/bm100064y",ref:"Katayama K et al., Br J Dermatol 1993, 129:95",notes:"Lipopeptide; widely used in anti-wrinkle formulations."},
  {id:88,name:"Aβ42 + Cu²⁺ complex",sn:"Aβ42-Cu",type:"Aggregation",seq:"DAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIA",pdb:null,cond:"pH 7.4, 10 µM CuCl₂",disease:"Alzheimer's disease",meth:"AFM, MS, EPR",doi:"10.1073/pnas.0506723102",ref:"Atwood CS et al., Biochemistry 2000, 39:10788",notes:"Redox-active Cu coordination alters aggregation pathway."},
  {id:89,name:"NDI-Gly2 supramolecular gelator",sn:"NDI-Gly2",type:"Self-Assembly",seq:"Naphthalene diimide-Gly-Gly conjugate",pdb:null,cond:"DMSO/water, pH 7.0",disease:"None (material)",meth:"TEM, XRD, CD, UV-Vis",doi:"10.1039/c2ob26560h",ref:"Bhosale RS et al., Org Biomol Chem 2012, 10:7697",notes:"π-π stacking of NDI core drives hydrogelation."},
  {id:90,name:"Fmoc-Val-OH gelator",sn:"Fmoc-V",type:"Self-Assembly",seq:"Fmoc-Val",pdb:null,cond:"DMSO/water, pH-decrease trigger",disease:"None (material)",meth:"XRD, TEM, FTIR",doi:"10.1039/c3ob27340a",ref:"Adams DJ et al., Soft Matter 2009, 5:1856",notes:"Hydrogel via pH reduction; worm-like micelle precursors."},
  {id:91,name:"Tau R1+R2 junction (273-301)",sn:"Tau-R1R2",type:"Amyloid",seq:"VQIINKKLDLSNVQSKC",pdb:null,cond:"pH 6.8, heparin, 37°C",disease:"Alzheimer's / Pick's disease",meth:"ssNMR, TEM",doi:"10.1126/science.1218031",ref:"Fitzpatrick AWP et al., Nature 2017, 547:185",notes:"R1-R2 junction defines 3R vs 4R tau fibril morphologies."},
  {id:92,name:"AAKLVFF hexapeptide",sn:"AAKLVFF",type:"Amyloid",seq:"AAKLVFF",pdb:null,cond:"pH 7.0, aqueous",disease:"Alzheimer's disease",meth:"TEM, ssNMR, CD",doi:"10.1021/ja0607095",ref:"Tjernberg LO et al., JBC 1996, 271:8545",notes:"Extended Aβ amyloid inhibitor scaffold."},
  {id:93,name:"Serum Amyloid P (SAP)",sn:"SAP",type:"Aggregation",seq:"Human SAP pentraxin domain (25 kDa)",pdb:"1LGN",cond:"pH 7.4, Ca²⁺ dependent, 37°C",disease:"Systemic amyloidosis (universal)",meth:"X-ray, TEM, SPR",doi:"10.1038/415385a",ref:"Pepys MB et al., Nature 2002, 417:254",notes:"Universal amyloid component; bound by all human amyloid deposits."},
  {id:94,name:"Tau Pick's disease strain",sn:"Tau-PiD",type:"Amyloid",seq:"3R tau isoform fibril core",pdb:"6GX5",cond:"Human Pick's disease brain",disease:"Pick's disease (3R-FTD)",meth:"CryoEM",doi:"10.1093/brain/awy300",ref:"Falcon B et al., Brain 2018, 141:3145",notes:"3R tau-only filaments; distinct fold from Alzheimer's disease."},
  {id:95,name:"FEFEFKFK octapeptide",sn:"FEFEFKFK",type:"Self-Assembly",seq:"FEFEFKFK",pdb:null,cond:"pH 5.0–8.0, aqueous",disease:"None (scaffold)",meth:"CD, TEM, FTIR",doi:"10.1021/bi990375d",ref:"Caplan MR et al., Biomacromolecules 2000, 1:627",notes:"Self-assembles at neutral pH into β-sheet nanofibers."},
  {id:96,name:"Silk sericin nanofibers",sn:"SSTSAA",type:"Self-Assembly",seq:"SSTSAA (sericin repeat)",pdb:null,cond:"Aqueous, physiological pH",disease:"None (biomaterial)",meth:"AFM, FTIR",doi:"10.1002/mabi.200600062",ref:"Numata K et al., Biomacromolecules 2010, 11:3189",notes:"Silk sericin-derived self-assembling peptide nanofibers."},
  {id:97,name:"PrP127-147 peptide",sn:"PrP127-147",type:"Amyloid",seq:"GYMLGSAMSRPIIHFGSDYED",pdb:null,cond:"pH 7.4, HEPES buffer",disease:"Prion disease",meth:"TEM, CD",doi:"10.1046/j.1365-2443.2000.00384.x",ref:"Muramoto T et al., Genes Cells 2000, 5:35",notes:"PrP fragment with demonstrated neurotoxic activity."},
  {id:98,name:"Aβ42 Osaka mutant (E22del)",sn:"Aβ42-E22del",type:"Amyloid",seq:"DAEFRHDSGYEVHHQKLVFFADVGSNKGAIIGLMVGGVVIA",pdb:null,cond:"pH 7.4, 37°C",disease:"Early-onset Alzheimer's (Osaka)",meth:"TEM, AFM, ThT",doi:"10.1038/nn.2398",ref:"Tomiyama T et al., Ann Neurol 2008, 63:123",notes:"Deletion mutant; forms non-fibrillar toxic oligomers."},
  {id:99,name:"Htt polyQ + flanking regions",sn:"Htt-polyQ",type:"Amyloid",seq:"polyQ + N17 amphipathic helix + PRD",pdb:null,cond:"pH 7.4, 37°C",disease:"Huntington's disease",meth:"ssNMR, TEM, AFM",doi:"10.1021/ja0718423",ref:"Poirier MA et al., JBC 2002, 277:14060",notes:"N17 flanking helix modulates polyQ aggregation kinetics."},
  {id:100,name:"Fmoc-Leu-OH gelator",sn:"Fmoc-L",type:"Self-Assembly",seq:"Fmoc-Leu",pdb:null,cond:"DMSO/water, pH 4–8",disease:"None (material)",meth:"CD, TEM, SAXS",doi:"10.1039/c3ob27340a",ref:"Raeburn J et al., Soft Matter 2015, 11:927",notes:"Low-MW hydrogelator via β-sheet hydrogen bonding."},
]

const PUBS = [
  {id:1,auth:"Reches M & Gazit E",year:2003,title:"Casting metal nanowires within discrete self-assembled peptide nanotubes",journal:"Science",vol:"300",pg:"625–627",doi:"10.1126/science.1082387",topic:"Self-Assembly"},
  {id:2,auth:"Petkova AT et al.",year:2005,title:"Self-propagating, molecular-level polymorphism in Alzheimer's β-amyloid fibrils",journal:"Science",vol:"307",pg:"262–265",doi:"10.1126/science.1105850",topic:"Amyloid"},
  {id:3,auth:"Wasmer C et al.",year:2008,title:"Amyloid fibrils of the HET-s(218–289) prion form a β solenoid with a triangular hydrophobic core",journal:"Science",vol:"319",pg:"1523–1526",doi:"10.1038/nature06725",topic:"Prion"},
  {id:4,auth:"Nelson R et al.",year:2005,title:"Structure of the cross-β spine of amyloid-like fibrils",journal:"Nature",vol:"435",pg:"773–778",doi:"10.1038/nature03680",topic:"Amyloid"},
  {id:5,auth:"Sawaya MR et al.",year:2007,title:"Atomic structures of amyloid cross-β spines reveal varied steric zippers",journal:"Nature",vol:"447",pg:"453–457",doi:"10.1038/nature05695",topic:"Amyloid"},
  {id:6,auth:"Fitzpatrick AWP et al.",year:2017,title:"Cryo-EM structures of tau filaments from Alzheimer's disease",journal:"Nature",vol:"547",pg:"185–190",doi:"10.1038/nature23002",topic:"Amyloid"},
  {id:7,auth:"Tuttle MD et al.",year:2016,title:"Solid-state NMR structure of a pathogenic fibril of full-length human α-synuclein",journal:"Nat Struct Mol Biol",vol:"23",pg:"409–415",doi:"10.1038/nsmb.3194",topic:"Amyloid"},
  {id:8,auth:"Murray DT et al.",year:2017,title:"Structure of FUS protein fibrils and its relevance to self-assembly and phase separation",journal:"Cell",vol:"171",pg:"615–627",doi:"10.1016/j.cell.2017.08.048",topic:"Aggregation"},
  {id:9,auth:"Silva GA et al.",year:2004,title:"Selective differentiation of neural progenitor cells by high-epitope density nanofibers",journal:"Science",vol:"303",pg:"1352–1355",doi:"10.1126/science.1082840",topic:"Self-Assembly"},
  {id:10,auth:"Schneider JP et al.",year:2002,title:"Responsive hydrogels from the intramolecular folding and self-assembly of a designed peptide",journal:"JACS",vol:"124",pg:"15030–15037",doi:"10.1021/ja012556x",topic:"Self-Assembly"},
  {id:11,auth:"Zhang S et al.",year:2003,title:"Fabrication of novel biomaterials through molecular self-assembly",journal:"Nat Biotechnol",vol:"21",pg:"1171–1178",doi:"10.1038/nbt874",topic:"Self-Assembly"},
  {id:12,auth:"O'Shea EK et al.",year:1991,title:"X-ray structure of the GCN4 leucine zipper, a two-stranded, parallel coiled coil",journal:"Science",vol:"254",pg:"539–544",doi:"10.1126/science.8346484",topic:"Self-Assembly"},
  {id:13,auth:"Lührs T et al.",year:2005,title:"3D structure of Alzheimer's amyloid-β(1–42) fibrils",journal:"PNAS",vol:"102",pg:"17342–17347",doi:"10.1073/pnas.0506723102",topic:"Amyloid"},
  {id:14,auth:"Arseni D et al.",year:2022,title:"Structure of pathological TDP-43 filaments from ALS with FTLD",journal:"Nature",vol:"601",pg:"139–143",doi:"10.1038/s41586-021-04199-3",topic:"Amyloid"},
  {id:15,auth:"Schweighauser M et al.",year:2020,title:"Structures of α-synuclein filaments from multiple system atrophy",journal:"Nature",vol:"585",pg:"464–469",doi:"10.1038/s41586-020-2412-1",topic:"Amyloid"},
  {id:16,auth:"Forloni G et al.",year:1993,title:"Neurotoxicity of a prion protein fragment",journal:"Nature",vol:"362",pg:"543–546",doi:"10.1038/362543a0",topic:"Prion"},
  {id:17,auth:"Smith AM et al.",year:2008,title:"Fmoc-diphenylalanine self assembles to a hydrogel via a novel architecture based on π–π interlocked β-sheets",journal:"Adv Mater",vol:"20",pg:"37–41",doi:"10.1039/b918426h",topic:"Self-Assembly"},
  {id:18,auth:"Alvarez Z et al.",year:2021,title:"Bioactive scaffolds with enhanced supramolecular motion promote recovery from spinal cord injury",journal:"Science",vol:"374",pg:"848–856",doi:"10.1126/science.abh3602",topic:"Self-Assembly"},
  {id:19,auth:"Qamar S et al.",year:2018,title:"FUS phase separation is modulated by a molecular chaperone and methylation of arginine cation-π interactions",journal:"Cell",vol:"173",pg:"720–734",doi:"10.1016/j.cell.2018.03.056",topic:"Aggregation"},
  {id:20,auth:"Pepys MB et al.",year:2001,title:"Targeted pharmacological depletion of serum amyloid P component for treatment of human amyloidosis",journal:"Nature",vol:"417",pg:"254–259",doi:"10.1038/35070530",topic:"Amyloid"},
]

const TYPES   = ["Amyloid","Self-Assembly","Aggregation"]
const ALL_DIS = [...new Set(MOLS.map(m=>m.disease))].sort()
const ALL_METH= ["NMR","ssNMR","TEM","AFM","CryoEM","X-ray","MicroED","CD","FTIR","SAXS","DLS","Rheology"]
const PER     = 15

/* ── shared style objects ── */
const inp = { padding:"9px 12px", border:`1px solid ${BD}`, borderRadius:"8px", fontSize:"13px", width:"100%", outline:"none", background:N3, color:TX, transition:"border-color .2s" }
const lbl = { fontSize:"10px", fontWeight:"700", letterSpacing:".08em", textTransform:"uppercase", color:MU, marginBottom:"5px", display:"block" }
const card= { background:N3, border:`1px solid ${BD}`, borderRadius:"12px", padding:"20px" }

const tcfg = {
  Amyloid:      { bg:"rgba(239,68,68,.12)",  col:"#f87171", bd:"rgba(239,68,68,.25)" },
  "Self-Assembly":{ bg:"rgba(59,130,246,.12)", col:"#60a5fa", bd:"rgba(59,130,246,.25)" },
  Aggregation:  { bg:"rgba(251,191,36,.1)",  col:GD,       bd:"rgba(251,191,36,.2)" },
}

function TBadge({ t }) {
  const c = tcfg[t] || { bg:"rgba(16,185,129,.1)", col:GR, bd:"rgba(16,185,129,.2)" }
  return <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:"20px", fontSize:"10px", fontWeight:"700", letterSpacing:".04em", background:c.bg, color:c.col, border:`1px solid ${c.bd}` }}>{t}</span>
}

function PBtn({ ch, onClick, style={} }) {
  return <button onClick={onClick} style={{ padding:"10px 22px", background:`linear-gradient(135deg,${BL},${SK})`, color:"#fff", borderRadius:"8px", fontSize:"13px", fontWeight:"700", boxShadow:"0 4px 14px rgba(59,130,246,.35)", fontFamily:"inherit", ...style }}>{ch}</button>
}

export default function App() {
  const [pg,    setPg]    = useState("home")
  const [user,  setUser]  = useState(null)
  const [modal, setModal] = useState(null)
  const [aTab,  setATab]  = useState("login")
  const [aF,    setAF]    = useState({ email:"", pass:"", name:"" })
  const [aErr,  setAErr]  = useState("")
  const [q,     setQ]     = useState("")
  const [fT,    setFT]    = useState("All")
  const [fD,    setFD]    = useState("All")
  const [fM,    setFM]    = useState("All")
  const [sF,    setSF]    = useState("id")
  const [sA,    setSA]    = useState(true)
  const [dP,    setDP]    = useState(1)
  const [vId,   setVId]   = useState(1)
  const [subs,  setSubs]  = useState([])
  const [sugs,  setSugs]  = useState([])
  const [subF,  setSubF]  = useState({ name:"", smiles:"", seq:"", type:"Amyloid", disease:"", method:"", cond:"", doi:"", notes:"" })
  const [subOk, setSubOk] = useState(false)
  const [sugF,  setSugF]  = useState({ name:"", email:"", subject:"General Feedback", msg:"", molName:"", molDoi:"" })
  const [sugOk, setSugOk] = useState(false)
  const [det,   setDet]   = useState(null)

  useEffect(() => {
    const u = store.get("saad_user")
    if (u) setUser(u)
    setSubs(store.get("saad_subs") || [])
    setSugs(store.get("saad_sugs") || [])
  }, [])

  const nav = p => { setPg(p); setDet(null); window.scrollTo(0,0) }

  const doLogin = () => {
    const { email, pass } = aF
    if (!email || !pass) { setAErr("All fields required."); return }
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const u = { email, name:"Amal Roy", role:"admin" }
      setUser(u); store.set("saad_user", u); setModal(null); setAErr(""); return
    }
    const users = store.get("saad_users") || []
    const f = users.find(u => u.email === email && u.pass === pass)
    if (f) {
      const u = { email:f.email, name:f.name, role:"user" }
      setUser(u); store.set("saad_user", u); setModal(null); setAErr("")
    } else setAErr("Invalid email or password.")
  }

  const doReg = () => {
    const { email, pass, name } = aF
    if (!email || !pass || !name) { setAErr("All fields required."); return }
    if (email === ADMIN_EMAIL) { setAErr("Email unavailable."); return }
    if (pass.length < 6) { setAErr("Password must be ≥ 6 characters."); return }
    const users = store.get("saad_users") || []
    if (users.find(u => u.email === email)) { setAErr("Email already registered."); return }
    store.set("saad_users", [...users, { email, pass, name }])
    const u = { email, name, role:"user" }
    setUser(u); store.set("saad_user", u); setModal(null); setAErr("")
  }

  const logout = () => { setUser(null); store.del("saad_user") }

  const filtered = useMemo(() => {
    let m = [...MOLS]
    if (q) { const lq = q.toLowerCase(); m = m.filter(x => x.name.toLowerCase().includes(lq) || (x.seq||"").toLowerCase().includes(lq) || x.disease.toLowerCase().includes(lq) || x.type.toLowerCase().includes(lq) || x.meth.toLowerCase().includes(lq) || x.ref.toLowerCase().includes(lq)) }
    if (fT !== "All") m = m.filter(x => x.type === fT)
    if (fD !== "All") m = m.filter(x => x.disease === fD)
    if (fM !== "All") m = m.filter(x => x.meth.includes(fM))
    m.sort((a,b) => { const va = String(a[sF]||"").toLowerCase(), vb = String(b[sF]||"").toLowerCase(); return sA ? va.localeCompare(vb) : vb.localeCompare(va) })
    return m
  }, [q, fT, fD, fM, sF, sA])

  const totP = Math.ceil(filtered.length / PER)
  const dbM  = filtered.slice((dP-1)*PER, dP*PER)
  const sc   = f => { if (sF===f) setSA(!sA); else { setSF(f); setSA(true) } }
  const arr  = f => sF===f ? (sA?" ↑":" ↓") : ""

  const doSubMol = () => {
    if (!subF.name || !subF.disease) { alert("Name and disease required."); return }
    const s = { ...subF, id:Date.now(), by:user?.email, byName:user?.name, status:"pending", at:Date.now() }
    const ns = [...subs, s]; setSubs(ns); store.set("saad_subs", ns); setSubOk(true)
    setSubF({ name:"", smiles:"", seq:"", type:"Amyloid", disease:"", method:"", cond:"", doi:"", notes:"" })
  }

  const doSubSug = () => {
    if (!sugF.name || !sugF.email || !sugF.msg) { alert("Name, email, message required."); return }
    const s = { ...sugF, id:Date.now(), at:Date.now() }
    const ns = [...sugs, s]; setSugs(ns); store.set("saad_sugs", ns); setSugOk(true)
    setSugF({ name:"", email:"", subject:"General Feedback", msg:"", molName:"", molDoi:"" })
  }

  const appSub = id => { const ns = subs.map(s => s.id===id ? {...s,status:"approved"} : s); setSubs(ns); store.set("saad_subs",ns) }
  const rejSub = id => { const ns = subs.map(s => s.id===id ? {...s,status:"rejected"} : s); setSubs(ns); store.set("saad_subs",ns) }
  const delSub = id => { const ns = subs.filter(s => s.id!==id); setSubs(ns); store.set("saad_subs",ns) }
  const delSug = id => { const ns = sugs.filter(s => s.id!==id); setSugs(ns); store.set("saad_sugs",ns) }

  const curV = MOLS.find(m => m.id===vId) || MOLS[0]

  const navLinks = [
    {id:"home",l:"Home"},{id:"database",l:"Database"},{id:"submit",l:"Submit"},
    {id:"visualization",l:"Visualize"},{id:"publications",l:"Publications"},
    {id:"contact",l:"Contact"},{id:"about",l:"About"},
    ...(user?.role==="admin" ? [{id:"admin",l:"⚙ Admin"}] : [])
  ]

  const SBadge = ({s}) => {
    const c = { pending:{bg:"rgba(251,191,36,.1)",col:GD,bd:"rgba(251,191,36,.2)"}, approved:{bg:"rgba(16,185,129,.1)",col:GR,bd:"rgba(16,185,129,.2)"}, rejected:{bg:"rgba(239,68,68,.1)",col:RD,bd:"rgba(239,68,68,.2)"} }
    const st = c[s] || c.pending
    return <span style={{padding:"3px 10px",borderRadius:"8px",fontSize:"10px",fontWeight:"800",background:st.bg,color:st.col,border:`1px solid ${st.bd}`,letterSpacing:".04em"}}>{s.toUpperCase()}</span>
  }

  /* ─────────────────────────────────────── RENDER ─────────────────────────────────────── */
  return (
    <div style={{ minHeight:"100vh", background:N, color:TX }}>

      {/* ── NAV ── */}
      <nav style={{ background:"rgba(5,13,26,.95)", backdropFilter:"blur(14px)", borderBottom:`1px solid ${BD}`, padding:"0 14px", display:"flex", alignItems:"center", height:"52px", position:"sticky", top:0, zIndex:300, gap:"10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", flexShrink:0 }} onClick={()=>nav("home")}>
          <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:`linear-gradient(135deg,${BL},${CY})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900", fontSize:"14px", color:"#fff", animation:"glow 3s infinite" }}>S</div>
          <div>
            <div style={{ fontSize:"14px", fontWeight:"800", lineHeight:1, letterSpacing:"-0.5px" }}>
              <span style={{color:CY}}>S</span><span style={{color:BL}}>A</span><span style={{color:SK}}>A</span><span style={{color:TX}}>D</span>
            </div>
            <div style={{ fontSize:"8px", color:MU, letterSpacing:".08em", marginTop:"2px" }}>SELF-ASSEMBLY & AGGREGATION DB</div>
          </div>
        </div>
        <div style={{ display:"flex", flex:1, gap:"1px", overflowX:"auto" }}>
          {navLinks.map(nl => (
            <button key={nl.id} onClick={()=>nav(nl.id)} style={{ padding:"5px 9px", borderRadius:"6px", fontSize:"12px", fontWeight:"600", background:pg===nl.id?"rgba(59,130,246,.15)":"transparent", color:pg===nl.id?"#60a5fa":DM, border:pg===nl.id?"1px solid rgba(59,130,246,.3)":"1px solid transparent", cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all .15s" }}>{nl.l}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:"6px", flexShrink:0, alignItems:"center" }}>
          {user ? (
            <>
              {user.role==="admin" && <span style={{ fontSize:"9px", fontWeight:"800", color:GD, background:"rgba(251,191,36,.1)", border:"1px solid rgba(251,191,36,.2)", padding:"3px 8px", borderRadius:"4px", letterSpacing:".06em" }}>PRIME ADMIN</span>}
              <span style={{ fontSize:"12px", color:DM, maxWidth:"90px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</span>
              <button onClick={logout} style={{ padding:"5px 10px", fontSize:"11px", borderRadius:"6px", border:`1px solid ${BD}`, color:MU, background:"transparent", cursor:"pointer", fontFamily:"inherit" }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={()=>{ setModal("auth"); setATab("login"); setAErr(""); setAF({email:"",pass:"",name:""}) }} style={{ padding:"5px 12px", fontSize:"12px", borderRadius:"6px", border:`1px solid ${BD}`, color:DM, background:"transparent", cursor:"pointer", fontFamily:"inherit" }}>Login</button>
              <button onClick={()=>{ setModal("auth"); setATab("register"); setAErr(""); setAF({email:"",pass:"",name:""}) }} style={{ padding:"5px 12px", fontSize:"12px", borderRadius:"6px", border:"none", color:"#fff", background:`linear-gradient(135deg,${BL},${SK})`, cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* ── AUTH MODAL ── */}
      {modal==="auth" && (
        <div onClick={e=>{ if(e.target===e.currentTarget) setModal(null) }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.78)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn .2s ease" }}>
          <div style={{ background:N3, border:`1px solid ${BD}`, borderRadius:"16px", padding:"32px", width:"380px", animation:"fadeUp .25s ease", boxShadow:"0 28px 70px rgba(0,0,0,.7)" }}>
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <div style={{ fontSize:"30px", marginBottom:"8px" }}>🔬</div>
              <h2 style={{ fontSize:"19px", fontWeight:"800", color:TX }}>SAAD Access</h2>
              <p style={{ fontSize:"12px", color:MU, marginTop:"4px" }}>Free scientific database access</p>
            </div>
            <div style={{ display:"flex", background:N2, borderRadius:"8px", padding:"3px", marginBottom:"20px" }}>
              {["login","register"].map(t => (
                <button key={t} onClick={()=>{ setATab(t); setAErr("") }} style={{ flex:1, padding:"7px", fontSize:"12px", fontWeight:"700", borderRadius:"6px", border:"none", cursor:"pointer", fontFamily:"inherit", background:aTab===t?BL:"transparent", color:aTab===t?"#fff":MU, transition:"all .15s" }}>{t==="login"?"Sign In":"Register"}</button>
              ))}
            </div>
            {aTab==="register" && <div style={{marginBottom:"12px"}}><label style={lbl}>Full Name</label><input style={inp} placeholder="Dr. Jane Smith" value={aF.name} onChange={e=>setAF({...aF,name:e.target.value})}/></div>}
            <div style={{marginBottom:"12px"}}><label style={lbl}>Email</label><input style={inp} type="email" placeholder="your@university.edu" value={aF.email} onChange={e=>setAF({...aF,email:e.target.value})}/></div>
            <div style={{marginBottom:"16px"}}><label style={lbl}>Password</label><input style={inp} type="password" placeholder="••••••••" value={aF.pass} onChange={e=>setAF({...aF,pass:e.target.value})} onKeyDown={e=>e.key==="Enter"&&(aTab==="login"?doLogin():doReg())}/></div>
            {aErr && <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", color:RD, padding:"8px 12px", borderRadius:"7px", fontSize:"12px", marginBottom:"12px" }}>{aErr}</div>}
            <button onClick={aTab==="login"?doLogin:doReg} style={{ width:"100%", padding:"11px", background:`linear-gradient(135deg,${BL},${SK})`, color:"#fff", border:"none", borderRadius:"9px", fontSize:"14px", fontWeight:"800", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(59,130,246,.4)", marginBottom:"10px" }}>{aTab==="login"?"Sign In →":"Create Account →"}</button>
            <button onClick={()=>setModal(null)} style={{ width:"100%", padding:"7px", background:"transparent", color:MU, border:"none", fontSize:"12px", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {det && (
        <div onClick={e=>{ if(e.target===e.currentTarget) setDet(null) }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.82)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn .2s ease", padding:"16px" }}>
          <div style={{ background:N3, border:`1px solid ${BD}`, borderRadius:"16px", padding:"28px", width:"min(620px,100%)", maxHeight:"85vh", overflowY:"auto", animation:"fadeUp .25s ease", boxShadow:"0 28px 70px rgba(0,0,0,.8)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
              <div>
                <TBadge t={det.type}/>
                <h2 style={{ fontSize:"18px", fontWeight:"800", color:TX, marginTop:"10px", marginBottom:"4px" }}>{det.name}</h2>
                <div style={{ fontSize:"13px", color:SK, fontWeight:"500" }}>{det.disease}</div>
              </div>
              <button onClick={()=>setDet(null)} style={{ background:"rgba(255,255,255,.05)", border:`1px solid ${BD}`, borderRadius:"7px", color:MU, padding:"5px 11px", cursor:"pointer", fontFamily:"inherit", fontSize:"15px" }}>✕</button>
            </div>
            {det.seq && <div style={{marginBottom:"14px"}}><div style={lbl}>Sequence</div><div style={{ fontFamily:"Menlo,Consolas,monospace", fontSize:"12px", color:CY, background:"rgba(6,182,212,.07)", border:"1px solid rgba(6,182,212,.15)", padding:"10px", borderRadius:"8px", wordBreak:"break-all", lineHeight:"1.8" }}>{det.seq}</div></div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px" }}>
              {[["Method",det.meth],["Conditions",det.cond],["PDB ID",det.pdb||"Not available"],["DOI",det.doi]].map(([l,v])=>(
                <div key={l} style={{ background:N2, borderRadius:"8px", padding:"10px" }}><div style={lbl}>{l}</div><div style={{ fontSize:"12px", color:TX, wordBreak:"break-all" }}>{v}</div></div>
              ))}
            </div>
            <div style={{ background:N2, borderRadius:"8px", padding:"12px", marginBottom:"14px" }}><div style={lbl}>Notes</div><div style={{ fontSize:"13px", color:DM, lineHeight:"1.75" }}>{det.notes}</div></div>
            <div style={{ fontSize:"12px", color:MU, fontStyle:"italic", marginBottom:"14px" }}>{det.ref}</div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              <a href={`https://doi.org/${det.doi}`} target="_blank" rel="noreferrer" style={{ padding:"8px 16px", background:`linear-gradient(135deg,${BL},${SK})`, color:"#fff", borderRadius:"7px", fontSize:"12px", fontWeight:"700" }}>View Publication ↗</a>
              {det.pdb && <a href={`https://www.rcsb.org/structure/${det.pdb}`} target="_blank" rel="noreferrer" style={{ padding:"8px 16px", background:"rgba(59,130,246,.1)", color:"#60a5fa", border:"1px solid rgba(59,130,246,.2)", borderRadius:"7px", fontSize:"12px", fontWeight:"700" }}>RCSB PDB ↗</a>}
              {det.pdb && <a href={`https://molstar.org/viewer/?pdb=${det.pdb}`} target="_blank" rel="noreferrer" style={{ padding:"8px 16px", background:"rgba(6,182,212,.1)", color:CY, border:"1px solid rgba(6,182,212,.2)", borderRadius:"7px", fontSize:"12px", fontWeight:"700" }}>Mol* 3D ↗</a>}
            </div>
          </div>
        </div>
      )}

      {/* ══════ HOME ══════ */}
      {pg==="home" && (
        <div>
          <div style={{ position:"relative", overflow:"hidden", padding:"80px 16px 64px", textAlign:"center", borderBottom:`1px solid ${BD}` }}>
            <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 55% at 50% 0%,rgba(59,130,246,.11) 0%,transparent 70%)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", top:"15%", left:"8%", width:"180px", height:"180px", borderRadius:"50%", background:"rgba(6,182,212,.04)", animation:"float 7s ease-in-out infinite", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", top:"20%", right:"10%", width:"130px", height:"130px", borderRadius:"50%", background:"rgba(59,130,246,.05)", animation:"float 9s ease-in-out infinite reverse", pointerEvents:"none" }}/>
            <div style={{ maxWidth:"720px", margin:"0 auto", position:"relative", animation:"fadeUp .6s ease" }}>
              <div style={{ display:"inline-block", padding:"4px 16px", borderRadius:"20px", background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.2)", color:"#60a5fa", fontSize:"11px", fontWeight:"700", letterSpacing:".1em", marginBottom:"22px" }}>OPEN-ACCESS SCIENTIFIC DATABASE</div>
              <h1 style={{ fontSize:"clamp(2rem,5vw,2.8rem)", fontWeight:"900", lineHeight:"1.15", marginBottom:"18px", letterSpacing:"-1.5px" }}>
                <span style={{color:TX}}>Molecular </span><span style={{ background:`linear-gradient(135deg,${CY},${BL})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self-Assembly</span>
                <br/><span style={{color:TX}}>& </span><span style={{ background:`linear-gradient(135deg,${BL},${SK})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Aggregation</span><span style={{color:TX}}> Database</span>
              </h1>
              <p style={{ fontSize:"1rem", color:DM, maxWidth:"560px", margin:"0 auto 32px", lineHeight:"1.85" }}>100 experimentally validated molecules and peptides — each linked to peer-reviewed literature in <em>Nature, Science, PNAS, Cell</em>, and <em>JACS</em>.</p>
              <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
                <PBtn ch="Explore Database →" onClick={()=>nav("database")} style={{ padding:"13px 32px", fontSize:"14px", fontWeight:"800", borderRadius:"10px" }}/>
                {!user && <button onClick={()=>{ setModal("auth"); setATab("register") }} style={{ padding:"13px 32px", fontSize:"14px", fontWeight:"800", borderRadius:"10px", background:"rgba(255,255,255,.04)", color:TX, border:`1px solid ${BD}`, cursor:"pointer", fontFamily:"inherit" }}>Register Free</button>}
              </div>
            </div>
          </div>
          {/* Stats */}
          <div style={{ background:N2, borderBottom:`1px solid ${BD}`, padding:"20px 16px" }}>
            <div style={{ maxWidth:"860px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
              {[{v:MOLS.length,l:"Total Entries"},{v:[...new Set(MOLS.map(m=>m.disease))].length,l:"Diseases Covered"},{v:MOLS.filter(m=>m.type==="Amyloid").length,l:"Amyloid Entries"},{v:MOLS.filter(m=>m.type==="Self-Assembly").length,l:"Self-Assembly"}].map(s=>(
                <div key={s.l} style={{ textAlign:"center", padding:"14px", borderRadius:"10px", background:N3, border:`1px solid ${BD}` }}>
                  <div style={{ fontSize:"2rem", fontWeight:"900", background:`linear-gradient(135deg,${CY},${BL})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.v}</div>
                  <div style={{ fontSize:"11px", color:MU, marginTop:"3px", fontWeight:"600", letterSpacing:".04em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Body */}
          <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"48px 16px" }}>
            <div style={{ textAlign:"center", marginBottom:"28px" }}>
              <h2 style={{ fontSize:"1.8rem", fontWeight:"800", color:TX, marginBottom:"8px", letterSpacing:"-0.5px" }}>Why SAAD?</h2>
              <p style={{ color:MU, fontSize:"14px" }}>Built for researchers who demand rigorous, peer-reviewed molecular data.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px", marginBottom:"48px" }}>
              {[{ic:"🧬",t:"Disease-Linked Data",d:"Every amyloid and aggregation entry connects to a disease: Alzheimer's, Parkinson's, ALS, Type 2 Diabetes, Huntington's, and 20+ more. Atomic-resolution understanding drives drug discovery."},{ic:"⚗️",t:"Nanotechnology & Biomaterials",d:"Self-assembling peptides form piezoelectric nanotubes, injectable hydrogels, and bioactive scaffolds for tissue engineering, drug delivery, and spinal cord repair."},{ic:"📡",t:"Structural Methods",d:"CryoEM, solid-state NMR, MicroED, TEM, AFM, SAXS, X-ray crystallography, CD. Direct links to RCSB PDB for crystal structures."},{ic:"🔐",t:"Admin-Controlled & Curated",d:"Administrator-verified entries only. User submissions reviewed before publication. All data referenced to high-impact peer-reviewed journals."}].map(f=>(
                <div key={f.t} style={card}>
                  <div style={{ fontSize:"26px", marginBottom:"12px" }}>{f.ic}</div>
                  <h3 style={{ fontSize:"15px", fontWeight:"700", color:TX, marginBottom:"6px" }}>{f.t}</h3>
                  <p style={{ color:MU, fontSize:"13px", lineHeight:"1.75" }}>{f.d}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
              <h2 style={{ fontSize:"1.5rem", fontWeight:"800", color:TX, letterSpacing:"-0.3px" }}>Featured Entries</h2>
              <button onClick={()=>nav("database")} style={{ padding:"6px 14px", fontSize:"12px", borderRadius:"7px", background:"rgba(59,130,246,.1)", color:"#60a5fa", border:"1px solid rgba(59,130,246,.2)", cursor:"pointer", fontFamily:"inherit", fontWeight:"600" }}>View all 100 →</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"40px" }}>
              {MOLS.slice(0,6).map((m,i) => (
                <div key={m.id} onClick={()=>setDet(m)} style={{ ...card, cursor:"pointer", animation:`fadeUp ${.35+i*.07}s ease` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                    <TBadge t={m.type}/>
                    {m.pdb && <span style={{ fontSize:"9px", color:SK, fontWeight:"700", background:"rgba(14,165,233,.08)", padding:"2px 7px", borderRadius:"4px", border:"1px solid rgba(14,165,233,.15)" }}>PDB ↗</span>}
                  </div>
                  <div style={{ fontSize:"14px", fontWeight:"700", color:TX, marginBottom:"4px" }}>{m.name}</div>
                  <div style={{ fontSize:"12px", color:MU, marginBottom:"10px" }}>{m.disease}</div>
                  {m.seq && <div style={{ fontFamily:"Menlo,Consolas,monospace", fontSize:"10px", color:CY, background:"rgba(6,182,212,.07)", border:"1px solid rgba(6,182,212,.12)", padding:"3px 7px", borderRadius:"5px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.seq.length>22?m.seq.substring(0,22)+"…":m.seq}</div>}
                  <div style={{ marginTop:"10px", fontSize:"11px", color:MU }}>{m.meth.split(",")[0].trim()}</div>
                </div>
              ))}
            </div>
            <div style={{ background:`linear-gradient(135deg,rgba(59,130,246,.14),rgba(6,182,212,.09))`, border:"1px solid rgba(59,130,246,.2)", borderRadius:"14px", padding:"36px", textAlign:"center" }}>
              <div style={{ fontSize:"11px", letterSpacing:".14em", color:CY, fontWeight:"800", marginBottom:"10px" }}>CONTRIBUTE TO SAAD</div>
              <h3 style={{ fontSize:"1.5rem", fontWeight:"800", color:TX, marginBottom:"10px", letterSpacing:"-0.3px" }}>Suggest a Molecule or Send Feedback</h3>
              <p style={{ color:MU, fontSize:"13px", marginBottom:"22px", lineHeight:"1.8", maxWidth:"480px", margin:"0 auto 22px" }}>Found a molecule missing? Have a correction? The administrator reviews every message personally.</p>
              <PBtn ch="Send Suggestion →" onClick={()=>nav("contact")} style={{ padding:"12px 30px", borderRadius:"10px" }}/>
            </div>
          </div>
        </div>
      )}

      {/* ══════ DATABASE ══════ */}
      {pg==="database" && (
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"28px 16px" }}>
          <div style={{ marginBottom:"18px" }}>
            <h1 style={{ fontSize:"1.8rem", fontWeight:"900", color:TX, letterSpacing:"-0.5px" }}>{filtered.length} Entries</h1>
            <p style={{ color:MU, fontSize:"12px", marginTop:"3px" }}>Showing {Math.min((dP-1)*PER+1,filtered.length)}–{Math.min(dP*PER,filtered.length)} of {filtered.length} · Click any row for full details</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr auto", gap:"8px", marginBottom:"12px", alignItems:"center" }}>
            <input style={inp} placeholder="🔍  Search name, sequence, disease, method…" value={q} onChange={e=>{ setQ(e.target.value); setDP(1) }}/>
            <select style={inp} value={fT} onChange={e=>{ setFT(e.target.value); setDP(1) }}><option value="All">All Types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
            <select style={inp} value={fD} onChange={e=>{ setFD(e.target.value); setDP(1) }}><option value="All">All Diseases</option>{ALL_DIS.map(d=><option key={d}>{d}</option>)}</select>
            <select style={inp} value={fM} onChange={e=>{ setFM(e.target.value); setDP(1) }}><option value="All">All Methods</option>{ALL_METH.map(m=><option key={m}>{m}</option>)}</select>
            <button onClick={()=>{ setQ(""); setFT("All"); setFD("All"); setFM("All"); setDP(1) }} style={{ padding:"9px 14px", borderRadius:"8px", border:`1px solid ${BD}`, background:"rgba(255,255,255,.03)", color:MU, cursor:"pointer", fontSize:"12px", fontFamily:"inherit", whiteSpace:"nowrap" }}>Clear</button>
          </div>
          <div style={{ background:N3, border:`1px solid ${BD}`, borderRadius:"12px", overflow:"hidden", marginBottom:"14px" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px", tableLayout:"fixed" }}>
                <colgroup>
                  <col style={{width:"32px"}}/><col style={{width:"185px"}}/><col style={{width:"105px"}}/><col style={{width:"148px"}}/>
                  <col style={{width:"120px"}}/><col style={{width:"140px"}}/><col style={{width:"162px"}}/><col style={{width:"68px"}}/>
                </colgroup>
                <thead>
                  <tr style={{ background:N2, borderBottom:`1px solid ${BD}` }}>
                    {[["id","#"],["name","Molecule Name"],["type","Type"],["disease","Disease"],["meth","Method"],["cond","Conditions"],[null,"Reference"],[null,""]].map(([f,h]) => (
                      <th key={h} onClick={()=>f&&sc(f)} style={{ padding:"10px 8px", textAlign:"left", fontSize:"10px", fontWeight:"700", color:MU, letterSpacing:".06em", textTransform:"uppercase", cursor:f?"pointer":"default", userSelect:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h}{f?arr(f):""}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dbM.map((m,i) => (
                    <tr key={m.id} onClick={()=>setDet(m)} style={{ borderBottom:`1px solid rgba(30,58,95,.5)`, background:i%2===0?N3:N2, cursor:"pointer", transition:"background .12s" }}>
                      <td style={{ padding:"9px 8px", color:MU, fontWeight:"700", fontSize:"11px" }}>{m.id}</td>
                      <td style={{ padding:"9px 8px" }}>
                        <div style={{ fontWeight:"700", color:TX, marginBottom:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:"12px" }}>{m.name}</div>
                        {m.seq && <div style={{ fontFamily:"Menlo,Consolas,monospace", fontSize:"9px", color:CY, background:"rgba(6,182,212,.07)", padding:"1px 5px", borderRadius:"3px", display:"inline-block", maxWidth:"160px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.seq.length>16?m.seq.substring(0,16)+"…":m.seq}</div>}
                      </td>
                      <td style={{ padding:"9px 8px" }}><TBadge t={m.type}/></td>
                      <td style={{ padding:"9px 8px", color:DM, fontSize:"11px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.disease}</td>
                      <td style={{ padding:"9px 8px", color:MU, fontSize:"11px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.meth}</td>
                      <td style={{ padding:"9px 8px", color:MU, fontSize:"11px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.cond}</td>
                      <td style={{ padding:"9px 8px" }}>
                        <div style={{ fontSize:"10px", color:DM, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.ref.substring(0,35)+(m.ref.length>35?"…":"")}</div>
                        <a href={`https://doi.org/${m.doi}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:"9px", color:SK, fontWeight:"700" }}>DOI ↗</a>
                      </td>
                      <td style={{ padding:"9px 8px" }}>
                        <button onClick={e=>{ e.stopPropagation(); setDet(m) }} style={{ padding:"4px 10px", background:`linear-gradient(135deg,${BL},${SK})`, color:"#fff", border:"none", borderRadius:"5px", fontSize:"10px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totP>1 && (
            <div style={{ display:"flex", gap:"5px", justifyContent:"center", alignItems:"center", fontSize:"12px" }}>
              <button onClick={()=>setDP(Math.max(1,dP-1))} disabled={dP===1} style={{ padding:"6px 13px", borderRadius:"7px", border:`1px solid ${BD}`, background:N3, cursor:dP===1?"default":"pointer", color:dP===1?BD:DM, fontFamily:"inherit" }}>← Prev</button>
              {[...Array(Math.min(totP,8))].map((_,i)=>{ const p=i+1; return <button key={p} onClick={()=>setDP(p)} style={{ padding:"6px 10px", borderRadius:"7px", border:`1px solid ${dP===p?BL:BD}`, background:dP===p?"rgba(59,130,246,.15)":N3, color:dP===p?"#60a5fa":DM, cursor:"pointer", fontFamily:"inherit", fontWeight:dP===p?"700":"400" }}>{p}</button> })}
              {totP>8 && <span style={{color:MU}}>… {totP}</span>}
              <button onClick={()=>setDP(Math.min(totP,dP+1))} disabled={dP===totP} style={{ padding:"6px 13px", borderRadius:"7px", border:`1px solid ${BD}`, background:N3, cursor:dP===totP?"default":"pointer", color:dP===totP?BD:DM, fontFamily:"inherit" }}>Next →</button>
            </div>
          )}
        </div>
      )}

      {/* ══════ VISUALIZATION ══════ */}
      {pg==="visualization" && (
        <div style={{ maxWidth:"1060px", margin:"0 auto", padding:"28px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
            <div>
              <h1 style={{ fontSize:"1.8rem", fontWeight:"900", color:TX, letterSpacing:"-0.5px" }}>Visualization</h1>
              <p style={{ color:MU, fontSize:"12px", marginTop:"3px" }}>Select any molecule to explore structural and experimental data.</p>
            </div>
            <select style={{ ...inp, width:"290px" }} value={vId} onChange={e=>setVId(Number(e.target.value))}>
              {MOLS.map(m => <option key={m.id} value={m.id}>{m.id}. {m.name}</option>)}
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"14px" }}>
            <div style={card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                <TBadge t={curV.type}/>
                {curV.pdb && <a href={`https://www.rcsb.org/structure/${curV.pdb}`} target="_blank" rel="noreferrer" style={{ fontSize:"11px", color:SK, fontWeight:"700", background:"rgba(14,165,233,.08)", padding:"3px 8px", borderRadius:"5px", border:"1px solid rgba(14,165,233,.2)" }}>PDB: {curV.pdb} ↗</a>}
              </div>
              <h2 style={{ fontSize:"1.3rem", fontWeight:"800", color:TX, marginBottom:"4px", letterSpacing:"-0.3px" }}>{curV.name}</h2>
              <div style={{ fontSize:"13px", color:SK, marginBottom:"16px", fontWeight:"500" }}>{curV.disease}</div>
              {curV.seq && <div style={{ marginBottom:"14px" }}><div style={lbl}>Sequence</div><div style={{ fontFamily:"Menlo,Consolas,monospace", fontSize:"12px", color:CY, background:"rgba(6,182,212,.07)", border:"1px solid rgba(6,182,212,.12)", padding:"10px", borderRadius:"8px", wordBreak:"break-all", lineHeight:"1.8", maxHeight:"90px", overflowY:"auto" }}>{curV.seq}</div></div>}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"12px" }}>
                {[["Method",curV.meth],["Conditions",curV.cond]].map(([l,v]) => (
                  <div key={l} style={{ background:N2, borderRadius:"8px", padding:"10px" }}><div style={lbl}>{l}</div><div style={{ fontSize:"12px", color:DM, lineHeight:"1.6" }}>{v}</div></div>
                ))}
              </div>
              <div style={{ fontSize:"12px", color:MU, fontStyle:"italic", marginBottom:"4px" }}>{curV.ref}</div>
              <a href={`https://doi.org/${curV.doi}`} target="_blank" rel="noreferrer" style={{ fontSize:"11px", color:SK }}>{curV.doi} ↗</a>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div style={card}>
                <div style={lbl}>3D Structure Viewer</div>
                {curV.pdb ? (
                  <div style={{ background:N2, borderRadius:"10px", padding:"18px", textAlign:"center" }}>
                    <div style={{ fontSize:"11px", color:MU, marginBottom:"12px" }}>Open in external 3D viewer:</div>
                    <div style={{ display:"flex", gap:"7px", flexWrap:"wrap", justifyContent:"center" }}>
                      {[["RCSB PDB",`https://www.rcsb.org/3d-view/${curV.pdb}`,BL],["Mol* Viewer",`https://molstar.org/viewer/?pdb=${curV.pdb}`,CY],["iCn3D",`https://www.ncbi.nlm.nih.gov/Structure/icn3d/?pdbid=${curV.pdb}`,"#7c3aed"]].map(([l,h,bg])=>(
                        <a key={l} href={h} target="_blank" rel="noreferrer" style={{ padding:"7px 14px", background:bg, color:"#fff", borderRadius:"7px", fontSize:"11px", fontWeight:"700" }}>{l} ↗</a>
                      ))}
                    </div>
                    <div style={{ fontSize:"11px", color:MU, marginTop:"10px" }}>PDB ID: {curV.pdb}</div>
                  </div>
                ) : (
                  <div style={{ background:N2, borderRadius:"10px", padding:"28px", textAlign:"center" }}>
                    <div style={{ fontSize:"34px", opacity:.25, marginBottom:"8px" }}>◇</div>
                    <div style={{ fontSize:"13px", color:MU }}>No crystal structure available</div>
                    <div style={{ fontSize:"11px", color:BD, marginTop:"6px" }}>Characterised by: {curV.meth}</div>
                  </div>
                )}
              </div>
              <div style={card}>
                <div style={lbl}>Scientific Notes</div>
                <div style={{ fontSize:"13px", color:DM, lineHeight:"1.8" }}>{curV.notes}</div>
              </div>
            </div>
          </div>
          <div style={{ ...card, background:"rgba(59,130,246,.05)", border:"1px solid rgba(59,130,246,.18)", marginBottom:"14px" }}>
            <div style={{ fontSize:"10px", color:CY, fontWeight:"800", letterSpacing:".1em", marginBottom:"10px" }}>AGGREGATION / ASSEMBLY PATHWAY</div>
            <div style={{ display:"flex", alignItems:"center", gap:"7px", flexWrap:"wrap" }}>
              {["Monomer","Nucleus","Oligomer","Protofilament","Mature Fibril"].map((s,i,a) => (
                <div key={s} style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                  <div style={{ padding:"6px 14px", borderRadius:"20px", fontSize:"11px", fontWeight:"700", background:["rgba(59,130,246,.15)","rgba(6,182,212,.15)","rgba(16,185,129,.15)","rgba(251,191,36,.12)","rgba(239,68,68,.12)"][i], color:["#60a5fa",CY,GR,GD,RD][i], border:`1px solid ${["rgba(59,130,246,.25)","rgba(6,182,212,.25)","rgba(16,185,129,.25)","rgba(251,191,36,.2)","rgba(239,68,68,.2)"][i]}` }}>{s}</div>
                  {i<a.length-1 && <div style={{ color:BD, fontWeight:"800", fontSize:"18px" }}>→</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {MOLS.slice(0,18).map(m => (
              <button key={m.id} onClick={()=>setVId(m.id)} style={{ padding:"5px 10px", borderRadius:"6px", fontSize:"10px", fontWeight:"600", background:vId===m.id?"rgba(59,130,246,.15)":N3, color:vId===m.id?"#60a5fa":MU, border:`1px solid ${vId===m.id?"rgba(59,130,246,.3)":BD}`, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>{m.sn}</button>
            ))}
          </div>
        </div>
      )}

      {/* ══════ SUBMIT ══════ */}
      {pg==="submit" && (
        <div style={{ maxWidth:"760px", margin:"0 auto", padding:"28px 16px" }}>
          <h1 style={{ fontSize:"1.8rem", fontWeight:"900", color:TX, marginBottom:"6px", letterSpacing:"-0.5px" }}>Submit Data</h1>
          <p style={{ color:MU, fontSize:"13px", marginBottom:"24px", lineHeight:"1.75" }}>Contribute experimentally validated molecule data. All submissions are reviewed by the administrator before publication.</p>
          {!user ? (
            <div style={{ ...card, textAlign:"center", padding:"40px", background:"rgba(59,130,246,.06)", border:"1px solid rgba(59,130,246,.18)" }}>
              <div style={{ fontSize:"44px", marginBottom:"14px" }}>🔒</div>
              <div style={{ fontSize:"16px", fontWeight:"800", color:TX, marginBottom:"8px" }}>Login required to submit data</div>
              <p style={{ color:MU, fontSize:"13px", marginBottom:"22px" }}>Create a free account to contribute to SAAD.</p>
              <PBtn ch="Login / Register →" onClick={()=>{ setModal("auth"); setATab("login") }}/>
            </div>
          ) : subOk ? (
            <div style={{ ...card, textAlign:"center", padding:"44px", background:"rgba(16,185,129,.06)", border:"1px solid rgba(16,185,129,.18)" }}>
              <div style={{ fontSize:"50px", marginBottom:"14px" }}>✅</div>
              <h3 style={{ fontSize:"19px", fontWeight:"800", color:GR, marginBottom:"8px" }}>Submission Received!</h3>
              <p style={{ color:MU, fontSize:"13px", marginBottom:"22px" }}>Your molecule has been submitted for administrator review.</p>
              <button onClick={()=>setSubOk(false)} style={{ padding:"9px 22px", background:"rgba(16,185,129,.12)", color:GR, border:"1px solid rgba(16,185,129,.2)", borderRadius:"8px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>Submit Another</button>
            </div>
          ) : (
            <div style={card}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
                <div><label style={lbl}>Molecule Name *</label><input style={inp} placeholder="e.g. Amyloid-β 1-42" value={subF.name} onChange={e=>setSubF({...subF,name:e.target.value})}/></div>
                <div><label style={lbl}>Aggregation Type *</label><select style={inp} value={subF.type} onChange={e=>setSubF({...subF,type:e.target.value})}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <div style={{marginBottom:"14px"}}><label style={lbl}>SMILES</label><input style={inp} placeholder="e.g. N[C@@H](Cc1ccccc1)…" value={subF.smiles} onChange={e=>setSubF({...subF,smiles:e.target.value})}/></div>
              <div style={{marginBottom:"14px"}}><label style={lbl}>Sequence (if peptide)</label><input style={inp} placeholder="e.g. KLVFF or AEAEAKAK" value={subF.seq} onChange={e=>setSubF({...subF,seq:e.target.value})}/></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
                <div><label style={lbl}>Disease Relevance *</label><input style={inp} placeholder="e.g. Alzheimer's disease" value={subF.disease} onChange={e=>setSubF({...subF,disease:e.target.value})}/></div>
                <div><label style={lbl}>Experimental Method</label><input style={inp} placeholder="e.g. ssNMR, TEM, CryoEM" value={subF.method} onChange={e=>setSubF({...subF,method:e.target.value})}/></div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
                <div><label style={lbl}>Conditions</label><input style={inp} placeholder="e.g. pH 7.4, 37°C, PBS" value={subF.cond} onChange={e=>setSubF({...subF,cond:e.target.value})}/></div>
                <div><label style={lbl}>DOI of Publication</label><input style={inp} placeholder="e.g. 10.1073/pnas.0506723102" value={subF.doi} onChange={e=>setSubF({...subF,doi:e.target.value})}/></div>
              </div>
              <div style={{marginBottom:"22px"}}><label style={lbl}>Additional Notes</label><textarea style={{ ...inp, minHeight:"88px" }} placeholder="Describe the aggregation behavior, significance, and key findings…" value={subF.notes} onChange={e=>setSubF({...subF,notes:e.target.value})}/></div>
              <PBtn ch="Submit for Review →" onClick={doSubMol} style={{ padding:"12px 30px", borderRadius:"9px" }}/>
            </div>
          )}
        </div>
      )}

      {/* ══════ PUBLICATIONS ══════ */}
      {pg==="publications" && (
        <div style={{ maxWidth:"940px", margin:"0 auto", padding:"28px 16px" }}>
          <h1 style={{ fontSize:"1.8rem", fontWeight:"900", color:TX, marginBottom:"6px", letterSpacing:"-0.5px" }}>Key Publications</h1>
          <p style={{ color:MU, fontSize:"13px", marginBottom:"28px", lineHeight:"1.75" }}>Seminal peer-reviewed works in molecular self-assembly, amyloid formation, and structural biology — the literature backbone of SAAD.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {PUBS.map((p,i) => {
              const tc = { Amyloid:{bg:"rgba(239,68,68,.1)",col:RD,bd:"rgba(239,68,68,.2)"}, Prion:{bg:"rgba(139,92,246,.1)",col:"#a78bfa",bd:"rgba(139,92,246,.2)"}, "Self-Assembly":{bg:"rgba(59,130,246,.1)",col:"#60a5fa",bd:"rgba(59,130,246,.2)"}, Aggregation:{bg:"rgba(251,191,36,.1)",col:GD,bd:"rgba(251,191,36,.2)"} }
              const tk = Object.keys(tc).find(k => p.topic.includes(k)); const cs = tk ? tc[tk] : tc.Aggregation
              return (
                <div key={p.id} style={{ ...card, display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:`linear-gradient(135deg,${BL},${CY})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"800", color:"#fff", flexShrink:0 }}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"13px", fontWeight:"700", color:TX, marginBottom:"5px", lineHeight:"1.55" }}>{p.auth} ({p.year}). {p.title}.</div>
                    <div style={{ display:"flex", gap:"10px", alignItems:"center", flexWrap:"wrap" }}>
                      <span style={{ fontSize:"12px", color:MU, fontStyle:"italic" }}>{p.journal} {p.vol}:{p.pg}</span>
                      <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" style={{ fontSize:"11px", color:SK, fontWeight:"700", background:"rgba(14,165,233,.08)", padding:"2px 8px", borderRadius:"4px", border:"1px solid rgba(14,165,233,.15)" }}>DOI ↗</a>
                    </div>
                  </div>
                  <span style={{ padding:"4px 10px", borderRadius:"8px", fontSize:"10px", fontWeight:"700", letterSpacing:".04em", flexShrink:0, background:cs.bg, color:cs.col, border:`1px solid ${cs.bd}` }}>{p.topic}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════ CONTACT ══════ */}
      {pg==="contact" && (
        <div style={{ maxWidth:"820px", margin:"0 auto", padding:"28px 16px" }}>
          <h1 style={{ fontSize:"1.8rem", fontWeight:"900", color:TX, marginBottom:"6px", letterSpacing:"-0.5px" }}>Contact & Suggestions</h1>
          <p style={{ color:MU, fontSize:"13px", marginBottom:"28px", lineHeight:"1.75" }}>Send feedback, corrections, or new molecule suggestions. All messages are reviewed personally by the SAAD administrator and replied via email.</p>
          {sugOk ? (
            <div style={{ ...card, textAlign:"center", padding:"44px", background:"rgba(16,185,129,.06)", border:"1px solid rgba(16,185,129,.18)" }}>
              <div style={{ fontSize:"50px", marginBottom:"14px" }}>✉️</div>
              <h3 style={{ fontSize:"19px", fontWeight:"800", color:GR, marginBottom:"8px" }}>Message Submitted!</h3>
              <p style={{ color:MU, fontSize:"13px", marginBottom:"22px" }}>The administrator will review and respond via email.</p>
              <button onClick={()=>setSugOk(false)} style={{ padding:"9px 22px", background:"rgba(16,185,129,.12)", color:GR, border:"1px solid rgba(16,185,129,.2)", borderRadius:"8px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>Send Another</button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:"20px" }}>
              <div style={card}>
                <h3 style={{ fontSize:"15px", fontWeight:"800", color:TX, marginBottom:"18px" }}>Send a Message</h3>
                <div style={{marginBottom:"12px"}}><label style={lbl}>Your Name *</label><input style={inp} placeholder="Dr. Jane Smith" value={sugF.name} onChange={e=>setSugF({...sugF,name:e.target.value})}/></div>
                <div style={{marginBottom:"12px"}}><label style={lbl}>Your Email *</label><input style={inp} type="email" placeholder="you@university.edu" value={sugF.email} onChange={e=>setSugF({...sugF,email:e.target.value})}/></div>
                <div style={{marginBottom:"12px"}}><label style={lbl}>Subject</label>
                  <select style={inp} value={sugF.subject} onChange={e=>setSugF({...sugF,subject:e.target.value})}>
                    {["General Feedback","New Molecule Suggestion","Data Correction","Collaboration Request","Other"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:"14px"}}><label style={lbl}>Message *</label><textarea style={{ ...inp, minHeight:"100px" }} placeholder="Describe your feedback, correction, or molecule suggestion…" value={sugF.msg} onChange={e=>setSugF({...sugF,msg:e.target.value})}/></div>
                <div style={{ borderTop:`1px solid ${BD}`, paddingTop:"14px", marginBottom:"14px" }}>
                  <div style={{ fontSize:"10px", fontWeight:"800", letterSpacing:".08em", textTransform:"uppercase", color:MU, marginBottom:"10px" }}>Suggest a New Molecule (optional)</div>
                  <input style={{ ...inp, marginBottom:"8px" }} placeholder="Molecule / peptide name" value={sugF.molName} onChange={e=>setSugF({...sugF,molName:e.target.value})}/>
                  <input style={inp} placeholder="DOI of reference publication" value={sugF.molDoi} onChange={e=>setSugF({...sugF,molDoi:e.target.value})}/>
                </div>
                <PBtn ch="Send Message →" onClick={doSubSug} style={{ width:"100%", padding:"12px", borderRadius:"9px" }}/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                <div style={card}>
                  <div style={{ fontSize:"10px", fontWeight:"800", letterSpacing:".08em", color:MU, marginBottom:"14px", textTransform:"uppercase" }}>Administrator</div>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
                    <div style={{ width:"46px", height:"46px", borderRadius:"50%", background:`linear-gradient(135deg,${BL},${CY})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:"900", color:"#fff", flexShrink:0 }}>AR</div>
                    <div>
                      <div style={{ fontWeight:"800", color:TX, fontSize:"14px" }}>Amal Roy</div>
                      <div style={{ fontSize:"11px", color:MU }}>SAAD Creator & Prime Admin</div>
                    </div>
                  </div>
                  <a href={`mailto:${ADMIN_EMAIL}`} style={{ display:"block", padding:"9px 12px", background:"rgba(59,130,246,.08)", border:"1px solid rgba(59,130,246,.15)", borderRadius:"8px", fontSize:"12px", color:"#60a5fa", fontWeight:"600", wordBreak:"break-all" }}>{ADMIN_EMAIL}</a>
                  <div style={{ marginTop:"10px", display:"inline-block", padding:"4px 12px", borderRadius:"6px", background:"rgba(251,191,36,.08)", border:"1px solid rgba(251,191,36,.15)", fontSize:"10px", fontWeight:"800", color:GD, letterSpacing:".06em" }}>PRIME OWNER</div>
                </div>
                <div style={card}>
                  <div style={{ fontSize:"10px", fontWeight:"800", letterSpacing:".08em", color:MU, marginBottom:"12px", textTransform:"uppercase" }}>How to Contribute</div>
                  {["Send feedback — corrections or missing data.","Suggest a new molecule with a DOI reference.","Use Submit Data for full structured submissions.","Admin verifies and publishes approved entries."].map((t,i) => (
                    <div key={i} style={{ display:"flex", gap:"10px", marginBottom:"10px", alignItems:"flex-start" }}>
                      <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:`linear-gradient(135deg,${BL},${CY})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"900", color:"#fff", flexShrink:0 }}>{i+1}</div>
                      <div style={{ fontSize:"12px", color:MU, lineHeight:"1.65" }}>{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════ ABOUT ══════ */}
      {pg==="about" && (
        <div style={{ maxWidth:"820px", margin:"0 auto", padding:"28px 16px" }}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <div style={{ width:"58px", height:"58px", borderRadius:"14px", background:`linear-gradient(135deg,${BL},${CY})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", fontWeight:"900", color:"#fff", margin:"0 auto 16px", animation:"glow 3s infinite" }}>S</div>
            <h1 style={{ fontSize:"2rem", fontWeight:"900", color:TX, marginBottom:"8px", letterSpacing:"-0.7px" }}>About SAAD</h1>
            <p style={{ color:MU, fontSize:"14px", maxWidth:"500px", margin:"0 auto", lineHeight:"1.8" }}>The Self-Assembly & Aggregation Database — an open-access scientific knowledge platform for the global research community.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"24px" }}>
            {[{t:"Mission",d:"SAAD provides open-access, curated, experimentally validated data on molecular self-assembly and aggregation — all referenced to peer-reviewed publications in high-impact journals."},{t:"Scientific Scope",d:"Amyloid-forming proteins, designed self-assembling systems, prion domains, LLPS/aggregation-prone low-complexity domains, and supramolecular gelators and biomaterials."},{t:"Quality Standards",d:"Every entry requires a DOI-linked peer-reviewed publication. Methods include CryoEM, ssNMR, TEM, AFM, X-ray, MicroED. Structural data links to RCSB PDB."},{t:"Target Audience",d:"PhD researchers, structural biologists, biochemists, and materials scientists studying peptide aggregation, amyloid biology, or supramolecular chemistry."}].map(f => (
              <div key={f.t} style={card}>
                <div style={{ fontSize:"10px", fontWeight:"800", letterSpacing:".08em", textTransform:"uppercase", color:"#60a5fa", marginBottom:"8px" }}>{f.t}</div>
                <p style={{ color:MU, fontSize:"13px", lineHeight:"1.75" }}>{f.d}</p>
              </div>
            ))}
          </div>
          <div style={{ ...card, background:`linear-gradient(135deg,rgba(59,130,246,.1),rgba(6,182,212,.07))`, border:"1px solid rgba(59,130,246,.2)", display:"flex", alignItems:"center", gap:"16px", marginBottom:"16px", flexWrap:"wrap" }}>
            <div style={{ width:"54px", height:"54px", borderRadius:"50%", background:`linear-gradient(135deg,${BL},${CY})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:"900", color:"#fff", flexShrink:0 }}>AR</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"17px", fontWeight:"900", color:TX, marginBottom:"2px" }}>Amal Roy</div>
              <div style={{ fontSize:"12px", color:SK, marginBottom:"6px" }}>Creator & Prime Administrator · SAAD</div>
              <a href={`mailto:${ADMIN_EMAIL}`} style={{ fontSize:"13px", color:"#60a5fa", fontWeight:"700" }}>{ADMIN_EMAIL}</a>
            </div>
            <div style={{ padding:"6px 14px", borderRadius:"8px", background:"rgba(251,191,36,.1)", border:"1px solid rgba(251,191,36,.2)", color:GD, fontSize:"11px", fontWeight:"800", letterSpacing:".06em" }}>PRIME OWNER</div>
          </div>
          <div style={{ padding:"14px 18px", borderRadius:"10px", background:N2, border:`1px solid ${BD}`, fontSize:"12px", color:MU, lineHeight:"1.7" }}>
            SAAD v3.0 · All molecular data sourced from and attributed to peer-reviewed literature · External links to RCSB PDB, Mol*, iCn3D, PubMed · © 2025 Amal Roy · Open-access scientific platform
          </div>
        </div>
      )}

      {/* ══════ ADMIN ══════ */}
      {pg==="admin" && user?.role==="admin" && (
        <div style={{ maxWidth:"1060px", margin:"0 auto", padding:"28px 16px" }}>
          <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"6px" }}>
            <h1 style={{ fontSize:"1.8rem", fontWeight:"900", color:TX, letterSpacing:"-0.5px" }}>Admin Dashboard</h1>
            <span style={{ padding:"4px 12px", background:"rgba(251,191,36,.1)", border:"1px solid rgba(251,191,36,.2)", borderRadius:"6px", color:GD, fontSize:"10px", fontWeight:"800", letterSpacing:".06em" }}>PRIME OWNER</span>
          </div>
          <p style={{ color:MU, fontSize:"12px", marginBottom:"24px" }}>Logged in as {user.email} · Full control over all database content and submissions</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"28px" }}>
            {[{l:"Total Molecules",v:MOLS.length,c:BL},{l:"Pending",v:subs.filter(s=>s.status==="pending").length,c:GD},{l:"Approved",v:subs.filter(s=>s.status==="approved").length,c:GR},{l:"Messages",v:sugs.length,c:CY}].map(s => (
              <div key={s.l} style={{ ...card, textAlign:"center" }}>
                <div style={{ fontSize:"2.2rem", fontWeight:"900", color:s.c }}>{s.v}</div>
                <div style={{ fontSize:"11px", color:MU, marginTop:"3px", fontWeight:"600", letterSpacing:".04em" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <h2 style={{ fontSize:"1.2rem", fontWeight:"800", color:TX, marginBottom:"14px" }}>User Submissions</h2>
          {subs.length===0 ? (
            <div style={{ ...card, textAlign:"center", padding:"28px", color:MU, fontSize:"13px", marginBottom:"28px" }}>No submissions yet.</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px" }}>
              {subs.map(s => (
                <div key={s.id} style={card}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
                    <div>
                      <div style={{ fontWeight:"800", color:TX, fontSize:"14px" }}>{s.name}</div>
                      <div style={{ fontSize:"11px", color:MU, marginTop:"3px" }}>By: {s.byName} · {s.by} · {new Date(s.at).toLocaleDateString()}</div>
                    </div>
                    <SBadge s={s.status}/>
                  </div>
                  <div style={{ fontSize:"12px", color:MU, marginBottom:"8px" }}>Type: {s.type} · Disease: {s.disease} · Method: {s.method}</div>
                  {s.notes && <div style={{ fontSize:"12px", color:DM, marginBottom:"10px", fontStyle:"italic", lineHeight:"1.6" }}>{s.notes}</div>}
                  <div style={{ display:"flex", gap:"8px" }}>
                    {s.status==="pending" && <>
                      <button onClick={()=>appSub(s.id)} style={{ padding:"6px 14px", background:"rgba(16,185,129,.12)", color:GR, border:"1px solid rgba(16,185,129,.2)", borderRadius:"6px", fontSize:"11px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>✓ Approve</button>
                      <button onClick={()=>rejSub(s.id)} style={{ padding:"6px 14px", background:"rgba(239,68,68,.1)", color:RD, border:"1px solid rgba(239,68,68,.2)", borderRadius:"6px", fontSize:"11px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>✗ Reject</button>
                    </>}
                    <button onClick={()=>delSub(s.id)} style={{ padding:"6px 14px", background:"rgba(255,255,255,.03)", color:MU, border:`1px solid ${BD}`, borderRadius:"6px", fontSize:"11px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <h2 style={{ fontSize:"1.2rem", fontWeight:"800", color:TX, marginBottom:"14px" }}>Contact Messages & Suggestions</h2>
          {sugs.length===0 ? (
            <div style={{ ...card, textAlign:"center", padding:"28px", color:MU, fontSize:"13px" }}>No messages yet.</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {sugs.map(s => (
                <div key={s.id} style={card}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
                    <div>
                      <div style={{ fontWeight:"800", color:TX, fontSize:"14px" }}>{s.name} — {s.subject}</div>
                      <a href={`mailto:${s.email}`} style={{ fontSize:"12px", color:SK, fontWeight:"600" }}>{s.email}</a>
                    </div>
                    <span style={{ fontSize:"11px", color:MU }}>{new Date(s.at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize:"13px", color:DM, marginBottom:"10px", lineHeight:"1.7" }}>{s.msg}</div>
                  {(s.molName||s.molDoi) && (
                    <div style={{ background:N2, borderRadius:"7px", padding:"10px", fontSize:"12px", color:MU, marginBottom:"10px" }}>
                      {s.molName && <div>Molecule: {s.molName}</div>}
                      {s.molDoi && <div>DOI: {s.molDoi}</div>}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:"8px" }}>
                    <a href={`mailto:${s.email}?subject=Re: ${encodeURIComponent(s.subject)}&body=Dear ${encodeURIComponent(s.name)},`} style={{ padding:"6px 14px", background:`linear-gradient(135deg,${BL},${SK})`, color:"#fff", borderRadius:"6px", fontSize:"11px", fontWeight:"700" }}>Reply via Email ↗</a>
                    <button onClick={()=>delSug(s.id)} style={{ padding:"6px 14px", background:"rgba(255,255,255,.03)", color:MU, border:`1px solid ${BD}`, borderRadius:"6px", fontSize:"11px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {pg==="admin" && user?.role!=="admin" && <div style={{ textAlign:"center", padding:"60px 16px", color:MU, fontSize:"14px" }}>Access denied. Admin login required.</div>}

      {/* ══════ FOOTER ══════ */}
      <footer style={{ background:N2, borderTop:`1px solid ${BD}`, padding:"28px 16px", marginTop:"60px", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"10px" }}>
          <div style={{ width:"24px", height:"24px", borderRadius:"6px", background:`linear-gradient(135deg,${BL},${CY})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"900", color:"#fff" }}>S</div>
          <span style={{ fontWeight:"800", fontSize:"14px" }}><span style={{color:CY}}>S</span><span style={{color:BL}}>A</span><span style={{color:SK}}>A</span><span style={{color:TX}}>D</span></span>
        </div>
        <div style={{ fontSize:"12px", color:MU, marginBottom:"5px" }}>All data sourced from peer-reviewed literature · Administrator: <a href={`mailto:${ADMIN_EMAIL}`} style={{ color:"#60a5fa", fontWeight:"600" }}>{ADMIN_EMAIL}</a></div>
        <div style={{ fontSize:"11px", color:BD }}>© 2025 Amal Roy · SAAD v3.0 · Open-access scientific platform · All rights reserved</div>
      </footer>

    </div>
  )
}
