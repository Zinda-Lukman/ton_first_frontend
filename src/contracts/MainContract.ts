import {
  Address,
  Cell,
  Contract,
  beginCell,
  contractAddress,
  ContractProvider,
  Sender,
  bigInt,
  SendMode,
} from "@ton/core";
export type MainContractConfig = {
  number: number;
  address: Address;
  owner_address: Address;
};

export function mainContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.owner_address)
    .endCell();
}

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromConfig(
    config: MainContractConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = mainContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new MainContract(address, init);
  }

  async sendIncrement(
    provider: ContractProvider,
    sender: Sender,
    value: bigInt,
    increment_by: number
  ) {
    const msg_body = beginCell()
      .storeUint(1, 32) //OP code
      .storeUint(increment_by, 32) // increment the int by
      .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigInt) {
    const msg_body = beginCell()
      .storeUint(2, 32) //OP code
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }
  async sendNoCodeDeposit(
    provider: ContractProvider,
    sender: Sender,
    value: bigInt
  ) {
    const msg_body = beginCell().endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendWithdrawalRequest(
    provider: ContractProvider,
    sender: Sender,
    value: bigInt,
    amount: bigInt
  ) {
    const msg_body = beginCell()
      .storeUint(3, 32) // op code
      .storeCoins(amount)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_the_latest_sender", []);
    return {
      number: stack.readNumber(),
      owner_address: stack.readAddress(),
      recent_sender: stack.readAddress(),
    };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return { number: stack.readNumber() };
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigInt) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }
}
