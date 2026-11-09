import { lookupCep } from './viaCep';

const reply = (body: unknown, ok = true) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok, json: async () => body } as Response);

afterEach(() => vi.restoreAllMocks());

describe('lookupCep', () => {
  it('fills street, city, state and IBGE code from ViaCEP', async () => {
    const spy = reply({
      logradouro: 'SQN 100',
      bairro: 'Asa Norte',
      localidade: 'Brasília',
      uf: 'DF',
      ibge: '5300108',
    });
    expect(await lookupCep('70.000-000')).toEqual({
      address: 'SQN 100, Asa Norte',
      city: 'Brasília',
      state: 'DF',
      ibgeCode: '5300108',
    });
    expect(spy).toHaveBeenCalledWith('https://viacep.com.br/ws/70000000/json/', expect.anything());
  });

  it('skips an incomplete CEP without calling the service', async () => {
    const spy = reply({});
    expect(await lookupCep('7000')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('answers null for an unknown CEP or when the service fails', async () => {
    reply({ erro: true });
    expect(await lookupCep('00000000')).toBeNull();
    reply({}, false);
    expect(await lookupCep('70000000')).toBeNull();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    expect(await lookupCep('70000000')).toBeNull();
  });
});
