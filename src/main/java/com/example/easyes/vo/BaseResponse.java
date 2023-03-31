package com.example.easyes.vo;

/**
 * server side response that will be return to front end.
 * 
 * @author chenyh
 *
 */
public class BaseResponse {
	/** name of stored procedure, required, passed from front end */
	public String method;
	
	/** extra info passed from front end */
	public String tag;
	
	/** business result code SUCCESS/FAIL */
	public String result;
	
	public String message;
	
	/** consumed time in milliseconds */
	public Long consumed;

}