package com.example.easyes.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * server side response that will be return to front end.
 * 
 * @author chenyh
 *
 */
public class QueryResponse extends BaseResponse {

	/** unique post id, JQuery dataTables passed */
	public Integer draw;

	/** skipped record number, JQuery dataTables passed */
	public Integer start;

	/** fetch record number, JQuery dataTables passed */
	public Integer length;

	/** return to JQuery dataTables */
	public Integer recordsTotal;

	/** return to JQuery dataTables */
	public Integer recordsFiltered;

	public String error;

	/** return actual query data */
	public List<Vo> data = new ArrayList<>();
}