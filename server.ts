import { config } from 'config';
import app from 'app';

app.listen(config.PORT, () => {
	console.log(`Server is listening on port ${config.PORT}`);
});
