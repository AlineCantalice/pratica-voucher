import { jest } from "@jest/globals"; 
import voucherService from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";
import { Voucher } from "@prisma/client";


describe("voucher unit test suite", () => {
  it("creates a voucher given valid data", async () => {
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);

    jest.spyOn(voucherRepository, "createVoucher").mockResolvedValueOnce(null);

    const newVoucher = {
      code: "0123456789ABCDEF",
      discount: 20,
    };    
    await voucherService.createVoucher(newVoucher.code, newVoucher.discount);
    
    expect(voucherRepository.createVoucher).toBeCalledTimes(1);
  });

  it("throws error when trying to add a duplicated voucher", async() => {
    const mockVoucher : Voucher = {
      id: 99,
      code: "voucher99code",
      discount: 19,
      used: false,
    };
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(mockVoucher);
    
    try {
      await voucherService.createVoucher(mockVoucher.code, mockVoucher.discount);
    } catch (error) {      
      expect(error.type).toBe("conflict");
      expect(error.message).toEqual("Voucher already exist.");
    }
  });

  it("throws error when trying to apply a voucher that does not exist", async() => {
    const mockApplyVoucher = {
      code: "apply_voucher_code",
      amount: 100,
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);

    try {
      await voucherService.applyVoucher(mockApplyVoucher.code, mockApplyVoucher.amount);
    } catch (error) {      
      expect(error.type).toBe("conflict");
      expect(error.message).toEqual("Voucher does not exist.");
    }

    
  });

});