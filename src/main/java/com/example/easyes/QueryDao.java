package com.example.easyes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.easyes.vo.QueryRequest;
import com.example.easyes.vo.QueryResponse;

/**
 * @author chenyh-a
 * @version created: 2023-02-23 15:34
 * 
 */
@Component
public class QueryDao {
	@Autowired
	ESClient client;

	public QueryResponse query(QueryRequest req) throws Exception {
		QueryResponse rsp = new QueryResponse();
		rsp = req.copy();
		Object o = req.data.get("search");
		String keyword = null;
		if (o != null && "".equals(o)) {
			keyword = o.toString();
		}
		rsp.recordsTotal = client.search("customer", keyword, "lastname", req.start, req.length, rsp.data);
		return rsp;
	}
}
