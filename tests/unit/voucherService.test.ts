import voucherService from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";
import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";

describe("test create voucher", () => {

    jest.spyOn(
        voucherRepository,
        "getVoucherByCode"
    ).mockImplementationOnce(() => null);
    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce(
        (code, discount) => {
            return null;
        }
    );

    it("test create item with success", async () => {
        const voucher = {
            code: faker.random.alphaNumeric(10),
            discount: 89,
        };
        await voucherService.createVoucher(voucher.code, voucher.discount);
    });

    jest.spyOn(
        voucherRepository,
        "getVoucherByCode"
    ).mockImplementationOnce((code): any => {
        return { code, discount: 10 };
    });

    it("test create voucher that already exists, conflict", async () => {
        const voucher = {
            code: faker.random.alphaNumeric(10),
            discount: 89,
        };
        try {
            await voucherService.createVoucher(
                voucher.code,
                voucher.discount
            );
            fail();
        } catch (e) {
            expect(e.type).toBe("conflict");
        }
    });
});

describe("test get voucher", () => {
    jest.spyOn(
        voucherRepository,
        "getVoucherByCode"
    ).mockImplementationOnce((code): any => null);

    it("Test get voucher that does not exist", async () => {
        try {
            await voucherService.applyVoucher("1212", 65);
            fail();
        } catch (err) {
            expect(err.type).toBe("conflict");
        }
    });

    jest.spyOn(
        voucherRepository,
        "getVoucherByCode"
    ).mockImplementationOnce((code): any => ({
        code,
        discount: 10,
        used: false,
    }));
    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce(
        (code): any => null
    );

    it("test exist voucher but did not use the code", async () => {
        try {
            const amount = 100;
            const voucher = await voucherService.applyVoucher("1", amount);
            expect(voucher.amount).toBe(amount);
            expect(voucher.discount).toBe(10);
            expect(voucher.applied).toBe(true);
            expect(voucher.finalAmount).toBe(amount - (amount * 10) / 100);
        } catch (err) {
            console.log(err);
            fail();
        }
    });
    
});