const { compiledContract } = require('../compile')
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const clearTextPassword = "SuperSecretPassword";
let accounts;
let deployedBodyMapContract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    deployedBodyMapContract = await new web3.eth.Contract(compiledContract.abi).deploy({ data: compiledContract.evm.bytecode.object, arguments: [clearTextPassword] }).send({ from: accounts[0], gas: '1000000' })
});

describe('BodyMap', () => {
    it('deploys', () => {
        assert.ok(deployedBodyMapContract.options.address);
        console.log(deployedBodyMapContract.options.address);
    })
    it('change bodymaps', async () => {
        await deployedBodyMapContract.methods.setBodyMaps(clearTextPassword, "New basic Body Map", "New tailor body map").send({ from: accounts[0], gas: '10000' })
        const updatedBasicBodyMap = await deployedBodyMapContract.methods.basicBodyMap().call();
        const updatedTailorBodyMap = await deployedBodyMapContract.methods.tailorBodyMap().call();
        assert.equal("New basic Body Map", updatedBasicBodyMap);
        assert.equal("New tailor body map", updatedTailorBodyMap)

    })
    it("can't change bodymaps with wrong password", async () => {
        await deployedBodyMapContract.methods.setBodyMaps("Wrong password", "New basic Body Map", "New tailor body map").send({ from: accounts[0], gas: '10000' })
        const updatedBasicBodyMap = await deployedBodyMapContract.methods.basicBodyMap().call();
        const updatedTailorBodyMap = await deployedBodyMapContract.methods.tailorBodyMap().call();
        assert.notEqual("New basic Body Map", updatedBasicBodyMap);
        assert.notEqual("New tailor body map", updatedTailorBodyMap)

    })
});