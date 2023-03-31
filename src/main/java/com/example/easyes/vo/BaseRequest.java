package com.example.easyes.vo;

/**
 * User request parameters passed from front end.
 * 
 * @author chenyh
 *
 */
public abstract class BaseRequest {
	/** SP name, in which you will implements specific BIZ rule, required */
	public String method;
	public String userCode;
	public String roleCode;
	public String tag;

	/**
	 * copy some properties from request to response
	 * 
	 * @return initial response object
	 */
	public abstract BaseResponse copy();

	public void baseCopy(BaseResponse rsp) {
		rsp.method = this.method;
		rsp.tag = this.tag;
	}
}