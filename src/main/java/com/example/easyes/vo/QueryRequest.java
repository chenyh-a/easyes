package com.example.easyes.vo;

/**
 * A common VO that contains user request parameters passed from front end.
 * it will accept searching criteria from JQuery dataTables JS component
 * 
 * @author chenyh
 *
 */
public class QueryRequest extends BaseRequest {
	/** required, query unique id */
	public Integer draw = 1;
	/** result record offset, default 0, from the first record*/
	public Integer start;
	/** page size */
	public Integer length = 10;
	/** order DB column */
	public String orderColumn;
	/** order direction: ASC/DESC */
	public String orderDir;
	/** search criteria */
	public Vo data = new Vo();

	@Override
	public QueryResponse copy() {
		QueryResponse rsp = new QueryResponse();
		super.baseCopy(rsp);
		rsp.draw = this.draw;
		rsp.start = this.start;
		rsp.length = this.length;
		return rsp;
	}
}