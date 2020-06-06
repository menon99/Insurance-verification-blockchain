const User = require('./models/userModel');
const Claim = require('./models/claimModel');
const Block = require('./models/blockModel');
const Case = require('./models/caseModel');
const Bank = require('./models/bankModel');
const Policy = require('./models/policyModel');
const Medical = require('./models/medicalModel');

require('./db/connect');

const insert = async() => {
    try {
        const user = new User({
            name: 'Akash',
            email: 'akash@gmail.com',
            password: 'halamadrid',
        });
        console.log('user created');
        await user.save();

        const police = new User({
            name: 'Police',
            userType: 'police',
            email: 'police@gmail.com',
            password: 'halamadrid',
        });
        await police.save();

        const bank = new User({
            name: 'Bank',
            userType: 'bank',
            email: 'bank@gmail.com',
            password: 'halamadrid',
        });
        await bank.save();

        const company = new User({
            name: 'Insurance',
            userType: 'company',
            email: 'company@gmail.com',
            password: 'halamadrid',
        });
        await company.save();

        const hospital = new User({
            name: 'Hospital',
            userType: 'hospital',
            email: 'hospital@gmail.com',
            password: 'halamadrid',
        });
        await hospital.save();

        const p1 = new Policy({
            user: user._id,
            policyName: 'Life Insurance',
            duration: '5 years',
            amount: 10 ** 6,
            expiry: Date(2022, 6, 10),
        });
        await p1.save();

        const p2 = new Policy({
            user: user._id,
            policyName: 'Health Insurance',
            duration: '10 years',
            amount: 10 ** 5,
            expiry: Date(2021, 3, 21),
        });
        await p2.save();
        console.log('policies created');

        const claim = new Claim({
            user: user._id,
            policy: p1._id,
        });
        await claim.save();

        console.log('claim created');

        const block = new Block({
            claim: claim._id,
        });
        await block.save();

        const case1 = new Case({
            user: user._id,
            description: 'Robbery',
        });
        await case1.save();

        const case2 = new Case({
            user: user._id,
            description: 'Murder',
        });
        await case2.save();

        const b1 = new Bank({
            user: user.id,
            assets: 10 ** 6,
            activeLoans: 2,
            activeLoanAmounts: 243000,
            creditRating: 720,
        });
        await b1.save();

        const med = new Medical({
            user: user.id,
            description: 'Cardiac arrest',
            billAmount: 450000,
        });
        await med.save();
        process.exit(0);
    } catch (e) {
        console.log(e);
    }
};

//insert();

module.exports = insert;