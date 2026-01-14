
vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(),
    },
  };
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(),
    },
  };
});

import { uploadFileToStorage } from './upload-file-to-storage';

import axios from 'axios';

vi.mock('axios');

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

describe('uploadFileToStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar a URL em caso de sucesso', async () => {

    mockedAxios.post.mockResolvedValue({
      data: { url: 'http://localhost:3333/uploads/test.txt' }
    });

    const file = new File(['conteúdo do arquivo'], 'test.txt', { type: 'text/plain' });
    const result = await uploadFileToStorage({ file });

    expect(result).toEqual({ url: 'http://localhost:3333/uploads/test.txt' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3333/uploads',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: undefined
      }
    );
  });

  it('deve lançar erro em caso de falha no upload', async () => {
    // Mock erro
    mockedAxios.post.mockRejectedValue(new Error('Erro de rede'));

    const file = new File(['conteúdo'], 'test.txt');

    await expect(uploadFileToStorage({ file })).rejects.toThrow('Failed to upload file to storage');
  });

  it('deve lançar erro quando cancelado', async () => {
    const controller = new AbortController();
    controller.abort();

    // rejeitar quando sinal é abortado
    mockedAxios.post.mockImplementation(() => {
      return Promise.reject(new Error('AbortError'));
    });

    const file = new File(['conteúdo'], 'test.txt');

    await expect(uploadFileToStorage({ file, signal: controller.signal })).rejects.toThrow();
  });
});
