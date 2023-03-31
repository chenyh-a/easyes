package com.example.easyes;

import java.io.File;
import java.util.List;

import javax.net.ssl.SSLContext;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.easyes.controller.QueryController;
import com.example.easyes.vo.Vo;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.indices.DeleteIndexResponse;
import co.elastic.clients.elasticsearch.indices.GetIndexResponse;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.TransportUtils;
import co.elastic.clients.transport.rest_client.RestClientTransport;

/**
 * @author chenyh-a
 * @version created: 2023-02-19 12:04
 * 
 */
@Component
public class ESClient {

	private static final String CERT_PATH = "D:\\elasticsearch-8.6.1\\config\\certs\\http_ca.crt";
	private static final String SCHEME = "https";
	private static final String HOSTNAME = "localhost";
	private static final int PORT = 9200;
	private static final String USERNAME = "elastic";
	private static final String PASSWORD = "832508";

	private static Logger log = LoggerFactory.getLogger(QueryController.class);
	private ElasticsearchClient client;

	private void init() {
		try {
			File certFile = new File(CERT_PATH);
			final SSLContext sslc = TransportUtils.sslContextFromHttpCaCrt(certFile);

			BasicCredentialsProvider bcp = new BasicCredentialsProvider();
			UsernamePasswordCredentials upc = new UsernamePasswordCredentials(USERNAME, PASSWORD);

			bcp.setCredentials(AuthScope.ANY, upc);
			HttpHost hh = new HttpHost(HOSTNAME, PORT, SCHEME);
			RestClient restClient = RestClient.builder(hh)
					.setHttpClientConfigCallback(hc -> hc.setSSLContext(sslc).setDefaultCredentialsProvider(bcp))
					.build();
			ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
			client = new ElasticsearchClient(transport);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}

	public int search(String indexName, String keyword, String searchField, int from, int size, List<Vo> resultData)
			throws Exception {

		if (client == null) {
			init();
		}
		SearchResponse<Vo> search = null;

		if (keyword == null) {
			search = client.search(s -> s.index(indexName).from(from).size(size)
			// .sort(s1 -> s1.field(f -> f.field(sortField).order(SortOrder.Asc)))
					, Vo.class);
		} else {
			search = client.search(s -> s.index(indexName)
					.query(q -> q.bool(b -> b.should(s2 -> s2.match(m2 -> m2.field(searchField).query(keyword)))
							.should(s2 -> s2.wildcard(w2 -> w2.field(searchField).wildcard("*" + keyword + "*")))))
					// .sort(s1 -> s1.field(f -> f.field(sortField).order(SortOrder.Asc)))
					.from(from).size(size), Vo.class);
		}
		int total = (int) search.hits().total().value();

		for (Hit<Vo> hit : search.hits().hits()) {
			log.debug(hit.source().toString());
			// pass result data to front-end
			resultData.add(hit.source());
		}
		return total;
	}

	public boolean createIndex(String indexName) throws Exception {
		if (client == null) {
			init();
		}
		return client.indices().create(c -> c.index(indexName)).acknowledged();
	}

	public GetIndexResponse getIndex(String indexName) throws Exception {
		if (client == null) {
			init();
		}
		return client.indices().get(c -> c.index(indexName));
	}

	public DeleteIndexResponse deleteIndex(String indexName) throws Exception {
		if (client == null) {
			init();
		}
		return client.indices().delete(c -> c.index(indexName));
	}

	public IndexResponse createDoc(String indexName, Vo vo, String id) throws Exception {
		if (client == null) {
			init();
		}
		IndexResponse ir = client.index(c -> c.index(indexName).id(id).document(vo));

		return ir;
	}

	public boolean existIndex(String indexName) {
		// TODO
		return false;
	}
}
