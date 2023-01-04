// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract SimpleSwap {
    ISwapRouter public immutable swapRouter;
    address public constant USDC = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
    address public constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    uint24 public constant feeTier = 3000;
    
    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }
    
    function swapWETHForUSDC(uint256 amountIn) external returns (uint256 amountOut) {

        // Transfer the specified amount of WETH to this contract.
        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountIn);
        // Approve the router to spend WETH.
        TransferHelper.safeApprove(WETH, address(swapRouter), amountIn);
        // Note: To use this example, you should explicitly set slippage limits, omitting for simplicity
        uint256 minOut = /* Calculate min output */ 0;
        uint160 priceLimit = /* Calculate price limit */ 0;
        // Create the params that will be used to execute the swap
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: USDC,
                fee: feeTier,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: priceLimit
            });
        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }
}