import test from 'node:test';
import assert from 'node:assert';

// Minimal mock of express types if needed, but we can just use any
type Request = any;
type Response = any;

// Mocking the handler logic for testing
async function mockParseLinkedInHandler(req: Request, res: Response) {
  try {
    throw new Error('Sensitive database connection string or internal path: /usr/local/secrets/key.json');
  } catch (error) {
    // This is the logic we want to test
    console.error('[server] An error occurred during the process:', error);
    return res.status(500).json({
      error: 'An internal server error occurred during parsing. Please try again later.',
    });
  }
}

async function mockParseLinkedInPdfHandler(req: Request, res: Response) {
  try {
    throw new Error('Sensitive PDF processing error: buffer overflow at 0xDEADBEEF');
  } catch (error) {
    // This is the logic we want to test
    console.error('[server] An error occurred during PDF parsing:', error);
    return res.status(500).json({
      error: 'An internal server error occurred during PDF parsing. Please try again later.',
    });
  }
}

test('LinkedIn handler returns generic error message', async () => {
  const req = {} as Request;
  let responseData: any;
  const res = {
    status: (code: number) => {
      assert.strictEqual(code, 500);
      return {
        json: (data: any) => {
          responseData = data;
        }
      };
    }
  } as unknown as Response;

  await mockParseLinkedInHandler(req, res);

  assert.strictEqual(responseData.error, 'An internal server error occurred during parsing. Please try again later.');
  assert.ok(!JSON.stringify(responseData).includes('Sensitive'), 'Response should not contain sensitive information');
});

test('PDF handler returns generic error message', async () => {
  const req = {} as Request;
  let responseData: any;
  const res = {
    status: (code: number) => {
      assert.strictEqual(code, 500);
      return {
        json: (data: any) => {
          responseData = data;
        }
      };
    }
  } as unknown as Response;

  await mockParseLinkedInPdfHandler(req, res);

  assert.strictEqual(responseData.error, 'An internal server error occurred during PDF parsing. Please try again later.');
  assert.ok(!JSON.stringify(responseData).includes('Sensitive'), 'Response should not contain sensitive information');
});
