const express = require("express");
const User = require("../models/userModel");
const Claim = require("../models/claimModel");
const Policy = require("../models/policyModel");
const Block = require("../models/blockModel");
const Bank = require('../models/bankModel');
const Medical = require('../models/medicalModel');
const redirectHome = require("../middleware/redirectHome");
const Case = require("../models/caseModel");

const router = express.Router();
router.use(express.json());

router.get("/login", redirectHome, (req, res) => {
    res.render("login");
});

router.post("/login", async(req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        req.session.user = user._id;
        req.session.save(() => {
            res.redirect("/home");
        });
    } catch (e) {
        res.render("login", {
            error: true,
        });
    }
});

router.get("/register", redirectHome, (req, res) => {
    res.render("signup");
});

router.post("/register", (req, res) => {
    try {
        let user = new User(req.body);
        user.save();
        req.session.user = user._id;
        res.redirect("/home");
    } catch (e) {
        res.render("signup", {
            error: true,
        });
    }
});

router.get("/logout", (req, res) => {
    delete req.session.user;
    res.redirect("/login");
});

router.get("/home", async(req, res) => {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        try {
            const user = await User.findById(req.session.user);
            req.user = user;
            if (req.user.userType === "user") return res.redirect("/home/user");
            else return res.redirect("/home/company");
        } catch (e) {
            return res.redirect("/login");
        }
    }
});

router.get("/home/company", async(req, res) => {
    try {
        const user = await User.findById(req.session.user);
        let ver;
        if (user.userType === "bank") ver = { bankVerified: false };
        else if (user.userType === "company") ver = { companyVerified: false };
        else if (user.userType === "police") ver = { policeVerified: false };
        else if (user.userType === "hospital") ver = { hospitalVerified: false };
        const claims = await Claim.find(ver).sort('createdAt');
        let c = [];
        claims.forEach(async(claim) => {
            c.push({
                claimId: claim.id
            });
        });
        return res.render('homeCompany', { claims: c });
    } catch (e) {
        res.status(500).send("Error");
    }
});

router.get("/home/user", async(req, res) => {
    try {
        const user = await User.findById(req.session.user);
        const pastClaims = await Claim.find({ user: user.id, verified: true }).sort(
            "createdAt"
        );
        const currentClaims = await Claim.find({
            user: user.id,
            verified: false,
        }).sort("-updatedAt");
        let past = [];
        pastClaims.forEach(async(claim) => {
            let p1 = await Policy.findById(claim.policy);
            past.push({
                claimId: claim.id,
                status: claim.status,
                policy: p1.policyName,
            });
        });
        let current = [];
        currentClaims.forEach(async(claim) => {
            let p1 = await Policy.findById({ _id: claim.policy });
            current.push({
                claimId: claim.id,
                policy: p1.policyName,
            });
        });
        res.render("homeUser", {
            past: past,
            current: current,
        });
    } catch (e) {
        res.status(500).send("Error");
    }
});

router.get('/view/:id', async(req, res) => {
    let id = req.params.id;
    const claim = await Claim.findById(id);
    const policy = await Policy.findById(claim.policy);
    let context = {};
    context.policyName = policy.policyName;
    context.claimId = id;
    const blocks = await Block.find({ claim: id });
    let b = [];
    blocks.forEach(block => {
        let v = {};
        v.policeVerified = block.policeVerified;
        v.companyVerified = block.companyVerified;
        v.hospitalVerified = block.hospitalVerified;
        v.bankVerified = block.bankVerified;
        v.hash = block.id;
        b.push(v);
    });
    context.blocks = b;
    const user = await User.findById(req.session.user);

    if (user.userType != 'user') {

        const u1 = await User.findById(claim.user);
        context.username = u1.name;

        if (user.userType === 'bank') {

            const bank = await Bank.findOne({ user: u1.id });
            context.headers = ['Assets', 'Active Loans',
                'Active Loan Amounts', 'Credit Rating'
            ];
            context.vals = [
                [bank.assets, bank.activeLoans, bank.activeLoanAmounts, bank.creditRating]
            ];

        } else if (user.userType === 'hospital') {

            const meds = await Medical.find({ user: u1.id });
            context.headers = ['Description', 'Bill Amount'];
            context.vals = [];
            meds.forEach(med => {
                let m = [med.description, med.billAmount];
                context.vals.push(m);
            });

        } else if (user.userType === 'company') {

            const policies = await Policy.find({ user: u1.id });
            context.headers = ['Policy Name', 'Duration', 'Amount', 'Expiry'];
            context.vals = [];
            policies.forEach(policy => {
                let p = [policy.policyName, policy.duration, policy.amount, policy.expiry];
                context.vals.push(p);
            });

        } else if (user.userType === 'police') {

            const cases = await Case.find({ user: u1.id });
            context.headers = ['Description'];
            context.vals = [];
            cases.forEach(c => {
                context.vals.push([c.description]);
            });
        }

        return res.render('blockView2', context);
    }

    return res.render('blockView', context);
});


router.get('/claim', async(req, res) => {
    try {
        const policies = await Policy.find({ user: req.session.user });
        let p = [];
        policies.forEach(policy => {
            p.push(policy.policyName);
        });
        return res.render('claim', { policies: p });
    } catch (e) {
        res.send('error');
    }
});

router.post('/claim', async(req, res) => {
    try {
        const user = await User.findById(req.session.user);
        const policy = await Policy.findOne({ policyName: req.body.policy, user: user.id });
        const claim = new Claim({
            policy: policy.id,
            user: user.id,
        });
        const block = new Block({
            claim: claim.id,
        });
        await claim.save();
        await block.save();
        return res.redirect('/home/user');
    } catch (e) {
        res.send("Error");
    }
});

router.get('/add/:id/:ch', async(req, res) => {
    let claimId = req.params.id;
    let choice = req.params.ch;
    const latestBlock = await Block.findOne({ claim: claimId }).sort("-createdAt").limit(1);
    const block = new Block({
        claim: claimId,
        policeVerified: latestBlock.policeVerified,
        hospitalVerified: latestBlock.hospitalVerified,
        bankVerified: latestBlock.bankVerified,
        companyVerified: latestBlock.companyVerified
    });
    const claim = await Claim.findById(claimId);
    const user = await User.findById(req.session.user);

    if (user.userType === 'bank') {
        block.bankVerified = choice;
        claim.bankVerified = true;
    } else if (user.userType === 'hospital') {
        block.hospitalVerified = choice;
        claim.hospitalVerified = true;
    } else if (user.userType === 'police') {
        block.policeVerified = choice;
        claim.policeVerified = true;
    } else if (user.userType === 'company') {
        block.companyVerified = choice;
        claim.companyVerified = true;
    }

    if (block.bankVerified != 'Pending' && block.hospitalVerified != 'Pending' &&
        block.policeVerified != 'Pending' && block.companyVerified != 'Pending') {
        claim.status = block.companyVerified;
        claim.verified = true;
    } else if (block.companyVerified != 'Pending') {
        claim.status = block.companyVerified;
        claim.verified = true;
    }
    await claim.save();
    await block.save();
    res.redirect('/home/company');
});

module.exports = router;