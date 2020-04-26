const Methods = {
    modalChange(couponVO) {
        const newCouponVO = {
            id: couponVO.id,
            content: couponVO.content,
            type: couponVO.type
        }
        switch (couponVO.type) {
            case 1:
                newCouponVO.off = couponVO.off;
                newCouponVO.subfix = "元";
                break;
            case 2:
                newCouponVO.off = parseInt(couponVO.off / 10) + '.' + parseInt(couponVO.off % 10);
                newCouponVO.subfix = "折";
                break;
        }
        return newCouponVO
    },
    realCost(cost, newCouponVO) {
        if (newCouponVO != null) {
            switch (newCouponVO.type) {
                case 1:
                    cost -= newCouponVO.off;
                    break;
                case 2:
                    cost = parseInt(cost *= newCouponVO.off) / 10
                    break;
            }
        }
        return cost;
    }
}
module.exports = Methods;